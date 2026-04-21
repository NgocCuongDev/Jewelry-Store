import axios from "axios";
import { API_URL } from "../../config";

// axios instance chung
const api = axios.create({
  baseURL: API_URL, // ví dụ: http://127.0.0.1:8000/api/
});

// Interceptor đơn giản hóa
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Auth token attached to request');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/dang-nhap';
    }
    
    return Promise.reject(error);
  }
);

// Lấy danh sách user (có phân trang, tìm kiếm, lọc)
export const getUsers = async (params = {}) => {
  try {
    const res = await api.get("user", { params });
    return res.data; // Laravel pagination: { data, meta, links }
  } catch (err) {
    console.error("❌ getUsers error:", err.response?.data || err.message);
    throw err;
  }
};

// Thêm user - ĐÃ SỬA LỖI
export const createUser = async (userData) => {
  try {
    const res = await api.post("user", userData);
    return res.data;
  } catch (err) {
    console.error("❌ createUser:", err.response?.data || err.message);
    throw err;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const res = await api.put(`update_client/${id}`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi updateUser:", err.response?.data || err.message);
    throw err;
  }
};

// Xóa user
export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`user/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi deleteUser:", err.response?.data || err.message);
    throw err;
  }
};

// Lấy chi tiết user theo id (nếu cần)
export const getUserById = async (id) => {
  try {
    const res = await api.get(`user/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi getUserById:", err.response?.data || err.message);
    return null;
  }
};

// Đăng nhập đơn giản không cần CSRF
export const loginUser = async (identifier, password) => {
  try {
    console.log('🔐 Attempting login for:', identifier);
    
    const res = await api.post("accounts/login", { 
      userName: identifier, 
      password 
    });
    
    console.log('✅ Login successful:', res.data);
    return {
      success: true,
      user: {
        id: res.data.userId,
        username: res.data.userName,
        image: res.data.userImage
      },
      token: res.data.token
    };
    
  } catch (err) {
    console.error('❌ Login failed:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
    
    if (err.response?.data) {
      throw err.response.data;
    }
    
    throw new Error('Đăng nhập thất bại. Vui lòng thử lại sau.');
  }
};

// Đăng xuất
export const logoutUser = async () => {
  try {
    const res = await api.post("accounts/logout");
    return res.data;
  } catch (err) {
    console.error("❌ logoutUser error:", err.response?.data || err.message);
    throw err;
  }
};

// Lấy thông tin user hiện tại - CẬP NHẬT ĐỂ BAO GỒM ADDRESS
export const getCurrentUser = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) return { success: false };
    
    const res = await api.get(`accounts/users/${user.id}`);
    console.log('👤 Current user data fetched:', res.data);
    
    return {
      success: true,
      user: {
        id: res.data.id,
        username: res.data.userName,
        image: res.data.userDetails?.image,
        email: res.data.userDetails?.email,
        phone: res.data.userDetails?.phoneNumber,
        name: `${res.data.userDetails?.firstName || ''} ${res.data.userDetails?.lastName || ''}`.trim(),
        address: [
          res.data.userDetails?.streetNumber,
          res.data.userDetails?.street,
          res.data.userDetails?.locality,
          res.data.userDetails?.country
        ].filter(Boolean).join(', ')
      }
    };
  } catch (err) {
    console.error("❌ getCurrentUser error:", err.response?.data || err.message);
    throw err;
  }
};
// Đăng ký user - ĐÃ SỬA
export const registerUser = async (userData) => {
  try {
    console.log('📝 Attempting register:', userData);
    
    const formattedData = {
      userName: userData.username,
      userPassword: userData.password,
      userDetails: {
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ').slice(1).join(' ') || '',
        email: userData.email,
        phoneNumber: userData.phone
      }
    };
    
    const res = await api.post("accounts/registration", formattedData);
    
    console.log('✅ Register successful:', res.data);
    return {
      success: true,
      user: res.data
    };
    
  } catch (err) {
    console.error('❌ Register failed - Full error:', err);
    
    // Hiển thị chi tiết lỗi validation
    if (err.response?.status === 422 && err.response?.data?.errors) {
      const validationErrors = err.response.data.errors;
      const firstError = Object.values(validationErrors)[0][0];
      throw new Error(firstError);
    }
    
    if (err.response?.data) {
      throw err.response.data;
    }
    
    throw new Error('Đăng ký thất bại. Vui lòng thử lại sau.');
  }
};

// Đổi mật khẩu
export const changePassword = async (passwordData) => {
  try {
    console.log('🔐 Changing password:', passwordData);
    
    const res = await api.put('change-password', passwordData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ Password changed successfully:', res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi changePassword:", err.response?.data || err.message);
    throw err;
  }
};