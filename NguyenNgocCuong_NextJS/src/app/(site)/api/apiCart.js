import axios from "axios";
import { API_URL } from "../../config";

const api = axios.create({
  baseURL: API_URL,
});

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
  (error) => Promise.reject(error)
);

export const getCartFromDB = async (cartId = "default-cart") => {
  try {
    const res = await api.get('shop/cart', { headers: { "Cart-Id": cartId } });
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) return [];
    throw err;
  }
};

export const addItemToDBCart = async (cartId, productId, quantity) => {
  try {
    const res = await api.post('shop/cart', null, {
      params: { productId, quantity },
      headers: { "Cart-Id": cartId }
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi thêm sản phẩm vào DB cart", err);
    throw err;
  }
};

export const removeItemFromDBCart = async (cartId, productId) => {
  try {
    const res = await api.delete('shop/cart', {
      params: { productId },
      headers: { "Cart-Id": cartId }
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm khỏi DB cart", err);
    throw err;
  }
};
