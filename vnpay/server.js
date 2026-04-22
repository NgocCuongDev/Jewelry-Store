import express from "express";
import cors from "cors";
import "dotenv/config";
import { VNPay } from "vnpay";
import axios from "axios";

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.VNPAY_PORT || process.env.PORT || 3002;

console.log("🔧 Environment check:", {
    tmnCode: process.env.VNP_TMN_CODE ? "✅ Set" : "❌ Missing",
    secret: process.env.VNP_HASH_SECRET ? "✅ Set" : "❌ Missing",
    port: PORT
});

const vnpay = new VNPay({
    tmnCode: process.env.VNP_TMN_CODE || '90AGV5CU',
    secureSecret: process.env.VNP_HASH_SECRET || '0UQNTQDZLAXLK3TWLNS0VYF8MG0XWRH0',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
});

// Route root
app.get("/", (req, res) => {
    res.json({ 
        message: "VNPay Gateway API is running!",
        version: "1.0.0",
        endpoints: {
            createPayment: "POST /vnpay/create-payment",
            returnUrl: "GET /vnpay/return",
            query: "GET /vnpay/query",
            health: "GET /health",
            test: "GET /test"
        },
        documentation: "Use one of the endpoints above for payment processing"
    });
});

// **API 1: Tạo URL thanh toán - FIXED**
app.post("/vnpay/create-payment", (req, res) => {
    try {
        console.log("📥 Received payment request:", JSON.stringify(req.body, null, 2));

        const { amount, orderId, orderInfo, customerEmail, returnUrl } = req.body;

        if (!amount || !orderId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin amount hoặc orderId'
            });
        }

        const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        
        // ========== FIX: XỬ LÝ AMOUNT CHÍNH XÁC ==========
        // Java gửi: 11,050,000 VND (số nguyên)
        // VNPay yêu cầu: Số tiền nhân với 100 (đơn vị là đồng)
        // Vì Java đã nhân 100 rồi, nên chúng ta cần xử lý đúng
        
        const numericAmount = parseInt(amount);
        
        console.log("💰💰💰 VNPAY AMOUNT DEBUG 💰💰💰");
        console.log("1. Received from Java:", numericAmount.toLocaleString('vi-VN') + ' VND');
        console.log("2. Raw amount:", numericAmount);
        
        // QUAN TRỌNG: Tính đúng số tiền cho VNPay
        // Cách 1: Nếu Java đã nhân 100, thì chúng ta cần số nguyên gốc
        // Ví dụ: 11,050,000 ÷ 100 = 110,500 (đây là số VNPay cần)
        const vnpAmount = numericAmount / 100;
        
        console.log("3. For VNPay:", vnpAmount);
        console.log("4. Expected on VNPay page:", (vnpAmount * 100).toLocaleString('vi-VN') + ' VND');
        console.log("💰💰💰 END DEBUG 💰💰💰");
        
        // Format orderInfo để tránh hiển thị khoa học
        const formattedOrderInfo = `Thanh toán đơn hàng ${orderId} - Số tiền: ${(numericAmount / 100).toLocaleString('vi-VN')} VND`;

        const vnpUrl = vnpay.buildPaymentUrl({
            vnp_Amount: vnpAmount, // Số tiền đã tính đúng
            vnp_IpAddr: ipAddr,
            vnp_TxnRef: orderId,
            vnp_OrderInfo: formattedOrderInfo,
            vnp_OrderType: "billpayment",
            vnp_ReturnUrl: returnUrl || `http://localhost:${PORT}/vnpay/return`,
            vnp_Locale: "vn",
            vnp_BankCode: "",
            vnp_CurrCode: "VND"
        });

        console.log("✅ Created VNPay URL:", vnpUrl);
        console.log("📋 VNPay parameters:", {
            amount: vnpAmount,
            expected_display: (vnpAmount * 100) + ' VND',
            orderId: orderId
        });
        
        res.json({
            success: true,
            paymentUrl: vnpUrl,
            orderId: orderId,
            amount: numericAmount,
            vnpAmount: vnpAmount,
            note: "Java amount ÷ 100 for VNPay"
        });

    } catch (error) {
        console.error("❌ Error creating payment:", error);
        res.status(500).json({
            success: false,
            message: 'Lỗi tạo thanh toán',
            error: error.message
        });
    }
});

// **API 2: Nhận kết quả từ VNPay - FIXED**
app.get("/vnpay/return", async (req, res) => {
    const query = req.query;
    
    console.log("📥 VNPay return data:", query);
    console.log("🔍 vnp_Amount from VNPay:", query.vnp_Amount);

    try {
        const verify = await vnpay.verifyReturnUrl(query);

        let redirectUrl = 'http://localhost:5173/';
        
        // Chuyển đổi số tiền từ VNPay về đúng format
        const vnpayAmount = query.vnp_Amount ? parseInt(query.vnp_Amount) : 0;
        const actualAmount = vnpayAmount / 100; // VNPay trả về số tiền đã nhân 100 (đơn vị xu/đồng)
        
        const params = new URLSearchParams({
            vnp_ResponseCode: query.vnp_ResponseCode || '',
            vnp_TransactionNo: query.vnp_TransactionNo || '',
            vnp_Amount: query.vnp_Amount || '', // Giữ nguyên số tiền gốc từ VNPay (đã nhân 100)
            vnp_TxnRef: query.vnp_TxnRef || '',
            vnp_OrderInfo: query.vnp_OrderInfo || '',
            vnp_BankCode: query.vnp_BankCode || '',
            vnp_PayDate: query.vnp_PayDate || ''
        });

        if (verify && query.vnp_ResponseCode === "00") {
            const orderId = query.vnp_TxnRef;
            console.log(`✅ Payment successful for order: ${orderId}`);
            console.log(`💰 Amount: ${actualAmount.toLocaleString('vi-VN')} VND`);
            
            // Gọi API backend chính
            try {
                const backendResponse = await axios.post('http://localhost:8080/api/payments/vnpay/callback', {
                    orderId: orderId,
                    transactionNo: query.vnp_TransactionNo,
                    amount: actualAmount, // Sử dụng số tiền đã convert
                    status: 'SUCCESS',
                    bankCode: query.vnp_BankCode,
                    paymentTime: query.vnp_PayDate
                });
                console.log('Backend update response:', backendResponse.data);
            } catch (backendError) {
                console.error('Error updating backend:', backendError);
            }
            
            redirectUrl += `?status=success&${params.toString()}`;
        } else {
            console.log(`❌ Payment failed: ${query.vnp_ResponseCode}`);
            redirectUrl += `?status=failed&${params.toString()}`;
        }

        console.log(`🔀 Redirecting to: ${redirectUrl}`);
        res.redirect(redirectUrl);

    } catch (error) {
        console.error("❌ Verification error:", error);
        res.redirect(`http://localhost:5173/payment/result?status=error&message=${encodeURIComponent(error.message)}`);
    }
});

// **API 3: Kiểm tra trạng thái**
app.get("/vnpay/query", async (req, res) => {
    try {
        const { orderId } = req.query;
        
        if (!orderId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Thiếu orderId' 
            });
        }

        res.json({
            success: true,
            orderId: orderId,
            status: 'SUCCESS',
            transactionNo: 'VNPAY_' + Date.now()
        });
        
    } catch (error) {
        console.error("❌ Query error:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi truy vấn',
            error: error.message 
        });
    }
});

// Health check
app.get("/health", (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'VNPay Gateway',
        port: PORT,
        tmnCode: process.env.VNP_TMN_CODE ? "✅" : "❌"
    });
});

// Test endpoint
app.get("/test", (req, res) => {
    res.json({ message: "VNPay Gateway is working!" });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Endpoint not found',
        availableEndpoints: [
            'GET /',
            'POST /vnpay/create-payment',
            'GET /vnpay/return',
            'GET /vnpay/query',
            'GET /health',
            'GET /test'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`✅ VNPay Gateway running on http://localhost:${PORT}`);
    console.log(`📝 TmnCode: ${process.env.VNP_TMN_CODE || 'CSEO1UKO (sandbox)'}`);
    console.log(`🌐 Open browser and go to: http://localhost:${PORT}`);
});