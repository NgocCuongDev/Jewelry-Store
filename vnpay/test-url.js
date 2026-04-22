import { VNPay } from "vnpay";

const vnpay = new VNPay({
    tmnCode: '90AGV5CU',
    secureSecret: '0UQNTQDZLAXLK3TWLNS0VYF8MG0XWRH0',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
});

const url = vnpay.buildPaymentUrl({
    vnp_Amount: 10000,
    vnp_IpAddr: '127.0.0.1',
    vnp_TxnRef: 'TEST_' + Date.now(),
    vnp_OrderInfo: 'Test payment with personal credentials',
    vnp_OrderType: 'other',
    vnp_ReturnUrl: 'http://localhost:3000/return',
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
});

console.log("Generated URL (New Credentials):", url);
