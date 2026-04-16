import axios from "axios";
import { IMAGE_URL, API_URL } from "../../config";

// Tạo axios instance dùng chung
const api = axios.create({
  baseURL: API_URL,
});

// ✅ THÊM INTERCEPTOR ĐỂ XỬ LÝ AUTHENTICATION
api.interceptors.request.use(
  (config) => {
    // Thêm token hoặc API key nếu có
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Hoặc thêm API key nếu dùng
    // config.headers['X-API-Key'] = 'your-api-key';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ XỬ LÝ LỖI TỐT HƠN
const handleError = (error) => {
  if (error.response) {
    // Server trả về lỗi
    console.error('❌ API Error:', {
      status: error.response.status,
      message: error.response.data?.message || error.message,
      url: error.config?.url
    });
    
    // Xử lý các lỗi cụ thể
    if (error.response.status === 401) {
      // Redirect đến login hoặc refresh token
      console.warn('⚠️ Unauthorized - Cần đăng nhập lại');
      // window.location.href = '/login';
    }
  } else if (error.request) {
    // Không nhận được response
    console.error('❌ Network Error:', error.message);
  } else {
    // Lỗi khác
    console.error('❌ Error:', error.message);
  }
  
  throw error;
};

// ================== DANH SÁCH SẢN PHẨM KHUYẾN MÃI ==================
export async function getProductSales({ page = 1, perPage = 12, search = "", status = "" } = {}) {
  try {
    const res = await api.get("pro-sale", {
      params: { 
        page, 
        per_page: perPage, 
        search, 
        status 
      },
      // ✅ THÊM TIMEOUT
      timeout: 10000
    });
    
    console.log("✅ API Response:", res.data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

// ================== CHI TIẾT 1 KHUYẾN MÃI ==================
export async function getProductSale(id) {
  try {
    const res = await api.get(`pro-sale/${id}`);
    return res.data;
  } catch (err) {
    handleError(err);
  }
}

// ================== TẠO MỚI ==================
export async function createProductSale(data) {
  try {
    const res = await api.post("pro-sale", data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

// ================== CẬP NHẬT ==================
export async function updateProductSale(id, data) {
  try {
    const res = await api.put(`pro-sale/${id}`, data);
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

// ================== XÓA ==================
export async function deleteProductSale(id) {
  try {
    const res = await api.delete(`pro-sale/${id}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

// ================== LẤY DANH SÁCH SẢN PHẨM ==================
export async function getProducts() {
  try {
    const res = await api.get("product"); // Sửa endpoint nếu cần
    return res.data;
  } catch (err) {
    handleError(err);
  }
}

// ================== IMPORT EXCEL ==================
export async function importProductSale(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("pro-sale/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
}