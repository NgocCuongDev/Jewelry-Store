// apiTopic.js
import axios from "axios";
import { IMAGE_URL, API_URL } from "../../config";

// Tạo axios instance dùng chung
const api = axios.create({
  baseURL: API_URL,
});

// =====================
// TOPIC API
// =====================

// Danh sách chủ đề (có phân trang, tìm kiếm, lọc)
export const getTopics = async (params = {}) => {
  try {
    const res = await api.get("topic-client", { params });
    return {
      success: true,
      data: res.data.data || [],
      pagination: res.data.pagination || {}
    };
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách chủ đề:", error);
    return {
      success: false,
      data: [],
      pagination: {},
      error: error.response?.data || error.message
    };
  }
};

// Lấy chi tiết chủ đề theo id
export const getTopicById = async (id) => {
  try {
    const res = await api.get(`topic/${id}`);
    return {
      success: true,
      data: res.data.data || res.data
    };
  } catch (error) {
    console.error("❌ Lỗi khi lấy chi tiết chủ đề:", error);
    return {
      success: false,
      data: null,
      error: error.response?.data || error.message
    };
  }
};

// Thêm chủ đề mới
export const createTopic = async (data) => {
  try {
    const res = await api.post("topic", data);
    return {
      success: true,
      data: res.data.data,
      message: res.data.message
    };
  } catch (error) {
    console.error("❌ Lỗi khi thêm chủ đề:", error);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

// Cập nhật chủ đề
export const updateTopic = async (id, data) => {
  try {
    const res = await api.put(`topic/${id}`, data);
    return {
      success: true,
      data: res.data.data,
      message: res.data.message
    };
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật chủ đề:", error);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

// Xóa chủ đề
export const deleteTopic = async (id) => {
  try {
    const res = await api.delete(`topic/${id}`);
    return {
      success: true,
      message: res.data.message
    };
  } catch (error) {
    console.error("❌ Lỗi khi xóa chủ đề:", error);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};