import axiosServer from "./axiosServer";

const apiRecommendation = {
  getAllRecommendations: () => {
    return axiosServer.get('/review/recommendations');
  },
  addRecommendation: (userId, productId, rating) => {
    return axiosServer.post(`/review/${userId}/recommendations/${productId}?rating=${rating}`);
  },
  deleteRecommendation: (id) => {
    return axiosServer.delete(`/review/recommendations/${id}`);
  }
}

export default apiRecommendation;
