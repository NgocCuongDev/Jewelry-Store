// app/(site)/api/apiOrder.js - THÊM HÀM HỦY ĐƠN HÀNG
import axios from "axios";
import { API_URL } from "../../config";

// ================== AXIOS INSTANCE ==================
const api = axios.create({
  baseURL: API_URL,
  timeout: 0,
});

// Thêm interceptor để tự động gắn token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Format lỗi chung
const formatError = (error) => {
  console.log("🔍 Chi tiết lỗi từ server:", {
    status: error.response?.status,
    data: error.response?.data,
    headers: error.response?.headers
  });

  if (error.response?.status === 422) {
    const validationErrors = error.response.data.errors;
    console.log("❌ Lỗi validation chi tiết:", validationErrors);
    
    return {
      message: "Dữ liệu không hợp lệ",
      errors: validationErrors,
      status: 422,
      details: error.response.data
    };
  }
  
  return error.response?.data || { 
    message: error.message || "Lỗi kết nối server",
    status: error.response?.status
  };
};

// ================== TẠO ĐƠN HÀNG MỚI ==================
export const createOrder = async (orderData) => {
  try {
    console.log("📦 Sending order data to backend:", orderData);
    
    const userId = orderData.userId;
    const cartId = orderData.cartId || "default-cart";
    
    const requestBody = { ...orderData };
    delete requestBody.userId;
    delete requestBody.cartId;

    const response = await api.post(`shop/order/${userId}`, requestBody, {
      headers: { "Cart-Id": cartId }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error creating order:", {
      message: error.response?.data?.message,
      error: error.response?.data?.error,
      fullError: error.response?.data
    });
    throw error.response?.data || error;
  }
};

// ================== HỦY ĐƠN HÀNG ==================
export const cancelOrder = async (orderId, reason = "") => {
  try {
    console.log("🗑️ Cancelling order:", orderId);
    
    const response = await api.post(`shop/order/${orderId}/cancel`, {
      cancel_reason: reason
    });
    
    console.log("✅ Order cancelled successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error cancelling order:", {
      message: error.response?.data?.message,
      error: error.response?.data?.error,
      fullError: error.response?.data
    });
    throw error.response?.data || error;
  }
};

// ================== DANH SÁCH ĐƠN HÀNG ==================
export const getOrders = async (params = {}) => {
  try {
    const res = await api.get("shop/order", { params });
    // Backend trả về List<Order> trực tiếp
    return {
      orders: res.data,
      meta: { total: res.data.length }
    };
  } catch (error) {
    throw formatError(error);
  }
};

// ================== CHI TIẾT ĐƠN HÀNG ==================
export const getOrderDetail = async (orderId) => {
  try {
    console.log("🔍 Fetching order detail for ID:", orderId);
    
    const response = await api.get(`shop/order/${orderId}`);
    console.log("✅ Order detail response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching order detail:", {
      status: error.response?.status,
      data: error.response?.data,
      fullError: error
    });
    throw error.response?.data || error;
  }
};

// ================== CẬP NHẬT TRẠNG THÁI ==================
export const updateOrderStatus = async (id, status) => {
  try {
    const res = await api.put(`shop/order/${id}`, { status });
    return res.data;
  } catch (error) {
    throw formatError(error);
  }
};

// ================== XÓA ĐƠN HÀNG ==================
export const deleteOrder = async (id) => {
  try {
    const res = await api.delete(`shop/order/${id}`);
    return res.data;
  } catch (error) {
    throw formatError(error);
  }
};

// ================== KHÔI PHỤC ĐƠN HÀNG ==================
export const restoreOrder = async (id) => {
  try {
    const res = await api.post(`shop/order/${id}/restore`);
    return res.data;
  } catch (error) {
    throw formatError(error);
  }
};

// ================== XUẤT HÓA ĐƠN PDF ==================
export const exportInvoice = async (id) => {
  try {
    const res = await api.get(`shop/order/${id}/invoice`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice_order_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    throw formatError(error);
  }
};
// ================== VNPAY INTEGRATION ==================
export const createVNPayPaymentUrl = async (paymentData) => {
  try {
    console.log('?? Requesting VNPay payment URL for data:', paymentData);
    const response = await api.post('vnpay/create-payment', paymentData);
    return response.data;
  } catch (error) {
    console.error('? Error creating VNPay payment URL:', error);
    throw error.response?.data || error;
  }
};
