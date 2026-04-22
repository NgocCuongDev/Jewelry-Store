import axiosServer from "./axiosServer";

const apiShipping = {
  getAllShipping: () => {
    return axiosServer.get('/shipping');
  },
  getShippingByOrderId: (orderId) => {
    return axiosServer.get(`/shipping/order/${orderId}`);
  },
  updateShippingStatus: (id, status) => {
    return axiosServer.put(`/shipping/${id}/status?status=${status}`);
  },
  createShipping: (orderId, address) => {
    return axiosServer.post(`/shipping?orderId=${orderId}&address=${address}`);
  }
}

export default apiShipping;
