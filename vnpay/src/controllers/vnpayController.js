// src/controllers/vnpayController.js
import { createVNPayPaymentUrl, verifyVNPayReturn } from '../services/vnpay/vnpayService.js';
import Order from '../models/Order.js';

export const vnpayController = {
  /**
   * Tạo payment URL cho VNPay
   */
  createPayment: async (req, res) => {
    try {
      const { orderId, amount, customerEmail, customerName, customerPhone } = req.body;
      
      if (!orderId || !amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin orderId hoặc amount'
        });
      }

      // Lấy IP của client
      const ipAddr = req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress || 
                     req.connection.socket.remoteAddress;

      const orderData = {
        orderId: orderId,
        amount: amount,
        customerEmail: customerEmail || '',
        customerName: customerName || '',
        customerPhone: customerPhone || ''
      };

      // Tạo VNPay URL
      const vnpUrl = await createVNPayPaymentUrl(orderData, ipAddr);

      // Lưu transaction info vào database (tùy chọn)
      await Order.findOneAndUpdate(
        { orderId: orderId },
        { 
          $set: { 
            paymentMethod: 'vnpay',
            paymentStatus: 'pending',
            vnpayTransaction: {
              ipAddr: ipAddr,
              paymentUrl: vnpUrl,
              createdAt: new Date()
            }
          }
        },
        { upsert: false }
      );

      return res.json({
        success: true,
        paymentUrl: vnpUrl,
        orderId: orderId,
        amount: amount
      });

    } catch (error) {
      console.error('Error creating VNPay payment:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo URL thanh toán VNPay',
        error: error.message
      });
    }
  },

  /**
   * Xử lý kết quả return từ VNPay
   */
  handleReturn: async (req, res) => {
    try {
      const queryParams = req.query;
      console.log('VNPay return params:', queryParams);

      // Xác thực kết quả từ VNPay
      const verifyResult = await verifyVNPayReturn(queryParams);

      if (!verifyResult.isValid) {
        console.log('VNPay verification failed:', verifyResult);
        // Redirect về frontend với status failed
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/result?status=failed&orderId=${queryParams.vnp_TxnRef}`);
      }

      const { transactionData } = verifyResult;

      // Cập nhật order trong database
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId: transactionData.orderId },
        { 
          $set: {
            paymentStatus: 'completed',
            paymentMethod: 'vnpay',
            transactionId: transactionData.transactionNo,
            paidAmount: transactionData.amount,
            paymentDetails: {
              bankCode: transactionData.bankCode,
              cardType: transactionData.cardType,
              payDate: transactionData.payDate,
              vnpayResponseCode: transactionData.responseCode,
              vnpayMessage: transactionData.message
            },
            updatedAt: new Date()
          }
        },
        { new: true }
      );

      console.log('✅ Order updated after VNPay payment:', updatedOrder);

      // Redirect về frontend với status success
      return res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/result?` +
        `status=success&` +
        `orderId=${transactionData.orderId}&` +
        `transactionNo=${transactionData.transactionNo}&` +
        `amount=${transactionData.amount}`
      );

    } catch (error) {
      console.error('Error handling VNPay return:', error);
      return res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/result?` +
        `status=error&` +
        `message=${encodeURIComponent('Lỗi xử lý thanh toán VNPay')}`
      );
    }
  },

  /**
   * IPN (Instant Payment Notification) - VNPay gọi server-to-server
   */
  handleIPN: async (req, res) => {
    try {
      const queryParams = req.query;
      console.log('VNPay IPN received:', queryParams);

      // Xác thực IPN
      const verifyResult = await verifyVNPayReturn(queryParams);

      if (verifyResult.isValid) {
        const { transactionData } = verifyResult;

        // Cập nhật order trong database
        await Order.findOneAndUpdate(
          { orderId: transactionData.orderId },
          { 
            $set: {
              paymentStatus: 'completed',
              transactionId: transactionData.transactionNo,
              paidAmount: transactionData.amount,
              paymentDetails: {
                bankCode: transactionData.bankCode,
                cardType: transactionData.cardType,
                payDate: transactionData.payDate
              },
              ipnReceived: true,
              ipnReceivedAt: new Date()
            }
          }
        );

        console.log('✅ IPN processed successfully for order:', transactionData.orderId);
      }

      // Trả về mã thành công cho VNPay
      return res.status(200).json({ RspCode: '00', Message: 'Success' });

    } catch (error) {
      console.error('Error processing IPN:', error);
      return res.status(200).json({ RspCode: '99', Message: 'Error' });
    }
  }
};