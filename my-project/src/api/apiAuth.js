import axiosServer from "./axiosServer";

const apiAuth = {
  login: (credentials) => {
    return axiosServer.post('/accounts/login', credentials);
  },
  register: (userData) => {
    return axiosServer.post('/accounts/users', userData);
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  forgotPassword: (email) => {
    return axiosServer.post('/accounts/forgot-password', { email });
  },
  verifyResetCode: (email, code) => {
    return axiosServer.post('/accounts/verify-reset-code', { email, code });
  },
  resetPassword: (email, code, newPassword) => {
    return axiosServer.post('/accounts/reset-password', { email, code, newPassword });
  },
}

export default apiAuth;
