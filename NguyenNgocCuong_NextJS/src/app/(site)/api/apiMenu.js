// app/(site)/api/apiMenu.js
import axios from "axios";
import { API_URL } from "../../config";

const api = axios.create({
  baseURL: API_URL,
});

// Lấy tất cả menu public (đã xử lý tree ở backend)
export const getMenus = async () => {
  try {
    const res = await api.get("menu/menus");
    return {
      success: true,
      data: res.data || []
    };
  } catch (error) {
    console.error('❌ Error fetching menus:', error);
    return { success: false, data: [] };
  }
};

export const getMenuById = async (id) => {
  const res = await api.get(`menu/menu/${id}`);
  return res.data;
};

export const createMenu = async (menuData) => {
  const res = await api.post("menu/menu", menuData);
  return res.data;
};