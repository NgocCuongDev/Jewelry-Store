import axios from 'axios';

// Create an Axios instance
const axiosServer = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom properties for easy access
axiosServer.defaults.IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
axiosServer.defaults.USER_IMAGE_URL = '/api/accounts';


// Request interceptor
axiosServer.interceptors.request.use(
  (config) => {
    // You can attach token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosServer.interceptors.response.use(
  (response) => {
    // Process response data here
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle global errors here
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosServer;
