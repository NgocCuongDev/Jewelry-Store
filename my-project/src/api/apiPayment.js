import axiosServer from "./axiosServer";

const apiPayment = {
  getAllPayments: () => {
    return axiosServer.get('/payment');
  },
  getPaymentsByOrderId: (orderId) => {
    return axiosServer.get(`/payment/order/${orderId}`);
  },
  processPayment: (orderId, userId, amount, method) => {
    return axiosServer.post(`/payment?orderId=${orderId}&userId=${userId}&amount=${amount}&method=${method}`);
  }
}

export default apiPayment;
