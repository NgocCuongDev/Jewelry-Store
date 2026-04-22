import axiosServer from "./axiosServer";

const apiOrder = {
  getAllOrders: () => {
    return axiosServer.get('/shop/orders');
  },
  getOrderById: (id) => {
    return axiosServer.get(`/shop/orders/${id}`);
  },
  createOrder: (userId, orderData) => {
    return axiosServer.post(`/shop/order/${userId}`, orderData);
  },
  updateOrderStatus: (id, status) => {
    return axiosServer.put(`/shop/orders/${id}/status?status=${status}`);
  }
}

export default apiOrder;
