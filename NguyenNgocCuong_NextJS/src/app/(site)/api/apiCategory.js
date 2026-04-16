import axios from "axios";
import { IMAGE_URL, API_URL } from "../../config";

const api = axios.create({
  baseURL: API_URL,
});

export const getCategories = async () => {
  try {
    // Gọi qua gateway: /api/catalog/categories
    const res = await api.get("catalog/categories");
    const list = Array.isArray(res.data) ? res.data : [];

    return {
      meta: { current_page: 1, last_page: 1, total: list.length },
      data: list.map((c) => ({
        id: c.id,
        name: c.categoryName || c.name,
        slug: c.slug || `danh-muc-${c.id}`,
        description: c.description || "",
        status: 1,
        image: IMAGE_URL + "no-category.png", // Entity mới chưa có trường ảnh
      })),
    };
  } catch (err) {
    console.error("❌ Lỗi lấy categories:", err);
    return {
      meta: { current_page: 1, last_page: 1, total: 0 },
      data: [],
    };
  }
};
