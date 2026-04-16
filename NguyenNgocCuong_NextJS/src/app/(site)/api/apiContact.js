// app/(site)/api/contactAPI.js
import axios from "axios";
import { API_URL } from "../../config";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/dang-nhap';
    }
    return Promise.reject(error);
  }
);

const contactAPI = {
  // Tạo liên hệ mới - ĐÃ SỬA ENDPOINT
  createContact: (contactData) => {
    return api.post('contact', contactData); // Sử dụng endpoint Laravel
  },

  // Lấy danh sách liên hệ (cho admin)
  getContacts: (params = {}) => {
    return api.get('contact', { params });
  },

  // Lấy thông tin chi tiết liên hệ
  getContact: (id) => {
    return api.get(`contact/${id}`);
  },

  // Trả lời liên hệ
  replyContact: (id, replyData) => {
    return api.put(`contact/${id}`, replyData);
  },

  // Xóa liên hệ
  deleteContact: (id) => {
    return api.delete(`contact/${id}`);
  }
};

export default contactAPI;