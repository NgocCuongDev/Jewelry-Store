import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const ShieldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0056b3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

export default function App() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [orderInfo, setOrderInfo] = useState({
    id: "",
    amount: 0,
    email: "user@example.com"
  });

  useEffect(() => {
    // Kiểm tra URL parameters khi trang tải
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get("status");
    const txnNo = queryParams.get("vnp_TransactionNo");
    const amountParam = queryParams.get("vnp_Amount");
    const errorCode = queryParams.get("vnp_ResponseCode");

    // LẤY THÔNG TIN ĐƠN HÀNG TỪ SHOP TRUYỀN SANG (HOẶC TỪ VNPAY TRẢ VỀ)
    const shopOrderId = queryParams.get("orderId") || queryParams.get("vnp_TxnRef");
    const shopAmount = queryParams.get("amount") || (amountParam ? (parseInt(amountParam) / 100) : null);
    const shopEmail = queryParams.get("email");

    if (shopOrderId || shopAmount) {
      setOrderInfo({
        id: shopOrderId || "N/A",
        amount: shopAmount ? parseInt(shopAmount) : 0,
        email: shopEmail || "user@example.com"
      });
    }

    if (paymentStatus === "success") {
      setStatus("success");
      setMessage(`✅ Thanh toán thành công! Mã GD: ${txnNo} - Số tiền: ${(parseInt(amountParam) / 100).toLocaleString()} VND`);
    } else if (paymentStatus === "failed") {
      setStatus("error");
      setMessage(`❌ Thanh toán thất bại. Mã lỗi: ${errorCode}`);
    } else if (paymentStatus === "error") {
      setStatus("error");
      setMessage(`⚠️ Lỗi xác thực thanh toán`);
    }
  }, []);

  const handlePayment = async () => {
    setStatus("loading");
    setMessage("");
    
    try {
      // Sử dụng thông tin từ URL truyền sang
      const res = await axios.post("http://localhost:3002/vnpay/create-payment", {
        amount: orderInfo.amount,
        orderId: orderInfo.id,
        orderInfo: `Thanh toán đơn hàng #${orderInfo.id} tại NNC PET SHOP`,
        customerEmail: orderInfo.email,
        returnUrl: `http://localhost:5173/?status=success`
      });

      console.log("Payment response:", res.data);
      
      if (res.data && res.data.success && res.data.paymentUrl) {
        // Redirect sang trang VNPay
        console.log("Redirecting to:", res.data.paymentUrl);
        window.location.href = res.data.paymentUrl;
      } else {
        setStatus("error");
        setMessage("Không nhận được link thanh toán từ server. " + (res.data?.message || ""));
      }
    } catch (e) {
      console.error("Payment error:", e);
      setStatus("error");
      setMessage("Lỗi kết nối đến máy chủ: " + (e.message || "Kiểm tra backend."));
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        {/* Header */}
        <div className="card-header">
          <ShieldIcon />
          <h1>Cổng Thanh Toán VNPay</h1>
          <p>Demo tích hợp - Terminal: 90AGV5CU</p>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="order-details">
          <div className="detail-row">
            <span>Mã đơn hàng:</span>
            <strong>#{orderInfo.id || 'N/A'}</strong>
          </div>
          <div className="detail-row">
            <span>Sản phẩm:</span>
            <span>Giỏ hàng từ NNC PET SHOP</span>
          </div>
          <div className="detail-row total">
            <span>Tổng thanh toán:</span>
            <span className="price">{(orderInfo.amount / 100).toLocaleString()} VND</span>
          </div>
        </div>

        {/* Thông báo */}
        {status === "success" && (
          <div className="alert success">
            ✅ {message}
          </div>
        )}
        
        {status === "error" && (
          <div className="alert error">
            ⚠️ {message}
          </div>
        )}

        {/* Nút thanh toán */}
        <button 
          onClick={handlePayment} 
          className={`pay-button ${status === "loading" ? "loading" : ""}`}
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? (
            <>
              <span className="spinner"></span>
              Đang kết nối VNPay...
            </>
          ) : status === "success" ? (
            "Đã thanh toán thành công"
          ) : (
            "Thanh toán ngay qua VNPay"
          )}
        </button>
        
        {/* Hướng dẫn test */}
        <div className="test-info">
          <h3>📋 Thông tin test:</h3>
          <p><strong>Ngân hàng:</strong> NCB</p>
          <p><strong>Thẻ test:</strong> 9704 1999 0199 0104</p>
          <p><strong>Chủ thẻ:</strong> NGUYEN VAN A</p>
          <p><strong>Ngày phát hành:</strong> 07/15</p>
          <p><strong>Mã OTP:</strong> 123456</p>
        </div>

        <div className="footer-note">
          <p>Bảo mật thanh toán chuẩn quốc tế.</p>
        </div>
      </div>
    </div>
  );
}