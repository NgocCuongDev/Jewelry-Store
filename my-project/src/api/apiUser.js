import axiosServer from "./axiosServer";

const apiUser = {
  // Placeholder for user-related API calls
  login: (credentials) => {
    return axiosServer.post('/accounts/login', credentials);
  },
  getProfile: (id) => {
    return axiosServer.get(`/accounts/users/${id}`);
  },
  getAllUsers: () => {
    return axiosServer.get('/accounts/users');
  },
  addUser: (userData) => {
    return axiosServer.post('/accounts/users', userData);
  },
  updateUser: (id, userData) => {
    return axiosServer.put(`/accounts/users/${id}`, userData);
  },
  deleteUser: (id) => {
    return axiosServer.delete(`/accounts/users/${id}`);
  }
}

export default apiUser;
