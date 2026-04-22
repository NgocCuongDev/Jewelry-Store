// src/services/vnpay/vnpayService.js
import { VNPay } from 'vnpay';
import 'dotenv/config';

// Khởi tạo VNPay với config từ environment
const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE || 'CSEO1UKO',
  secureSecret: process.env.VNP_HASH_SECRET || '8UKRJ3T794UDL3FXK5UKD0EXK7PGH78U',
  testMode: process.env.NODE_ENV !== 'production', // true cho dev, false cho production
});

/**
 * Tạo URL thanh toán VNPay
 * @param {Object} orderData - Thông tin đơn hàng
 * @param {string} orderData.orderId - Mã đơn hàng
 * @param {number} orderData.amount - Số tiền (đơn vị: đồng, phải nhân 100 cho VNPay)
 * @param {string} orderData.customerEmail - Email khách hàng
 * @param {string} orderData.customerName - Tên khách hàng
 * @param {string} orderData.customerPhone - Số điện thoại
 * @param {string} ipAddr - Địa chỉ IP của khách hàng
 * @returns {Promise<string>} - URL thanh toán VNPay
 */
export const createVNPayPaymentUrl = async (orderData, ipAddr) => {
  try {
    const paymentData = {
      vnp_Amount: orderData.amount * 100, // Nhân 100 theo yêu cầu VNPay
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: orderData.orderId,
      vnp_OrderInfo: `Thanh toán đơn hàng ${orderData.orderId}`,
      vnp_OrderType: 'billpayment',
      vnp_ReturnUrl: `${process.env.BASE_URL || 'http://localhost:8080'}/api/vnpay/return`,
      vnp_Locale: 'vn',
      vnp_BankCode: '',
      vnp_CreateDate: new Date().toISOString().replace(/[-:T]/g, '').split('.')[0],
    };

    const vnpUrl = vnpay.buildPaymentUrl(paymentData);
    console.log('✅ VNPay URL created:', {
      orderId: orderData.orderId,
      amount: orderData.amount,
      vnpUrl: vnpUrl.substring(0, 100) + '...'
    });

    return vnpUrl;
  } catch (error) {
    console.error('❌ Error creating VNPay URL:', error);
    throw new Error('Không thể tạo URL thanh toán VNPay');
  }
};

/**
 * Xác thực kết quả thanh toán từ VNPay
 * @param {Object} queryParams - Query parameters từ VNPay return
 * @returns {Promise<Object>} - Kết quả xác thực
 */
export const verifyVNPayReturn = async (queryParams) => {
  try {
    const verifyResult = await vnpay.verifyReturnUrl(queryParams);
    
    return {
      isValid: verifyResult && queryParams.vnp_ResponseCode === '00',
      transactionData: {
        orderId: queryParams.vnp_TxnRef,
        transactionNo: queryParams.vnp_TransactionNo,
        amount: queryParams.vnp_Amount ? parseInt(queryParams.vnp_Amount) / 100 : 0,
        bankCode: queryParams.vnp_BankCode,
        cardType: queryParams.vnp_CardType,
        payDate: queryParams.vnp_PayDate,
        responseCode: queryParams.vnp_ResponseCode,
        message: getVNPayMessage(queryParams.vnp_ResponseCode),
      }
    };
  } catch (error) {
    console.error('❌ Error verifying VNPay return:', error);
    return {
      isValid: false,
      error: error.message
    };
  }
};

/**
 * Lấy thông báo từ mã response VNPay
 */
const getVNPayMessage = (responseCode) => {
  const messages = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
    '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
    '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
    '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
    '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
    '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
    '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
    '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
    '75': 'Ngân hàng thanh toán đang bảo trì.',
    '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
    '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
  };
  
  return messages[responseCode] || `Mã lỗi không xác định: ${responseCode}`;
};

export default {
  createVNPayPaymentUrl,
  verifyVNPayReturn
};