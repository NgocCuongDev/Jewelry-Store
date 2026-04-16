import axios from "axios";
import { IMAGE_URL, API_URL } from "../../config";

// Tạo axios instance dùng chung gọi qua Gateway
const api = axios.create({
  baseURL: API_URL,
});

/**
 * Chuẩn hóa dữ liệu sản phẩm từ Spring Boot sang cấu trúc UI mong đợi
 */
const formatProduct = (p) => {
  if (!p) return null;

  // Xử lý đường dẫn ảnh để tránh lặp 'images/images/'
  let cleanImageUrl = p.imageUrl || "";
  if (cleanImageUrl.startsWith("images/")) {
    cleanImageUrl = cleanImageUrl.replace("images/", "");
  }

  const finalImageUrl = cleanImageUrl 
    ? (cleanImageUrl.startsWith("http") ? cleanImageUrl : IMAGE_URL + cleanImageUrl.replace(/^\/+/, ""))
    : IMAGE_URL + "no-image.png";

  return {
    id: p.id,
    name: p.productName || p.name, 
    price: p.discountPrice ? Number(p.discountPrice) : Number(p.price), 
    oldPrice: Number(p.price),
    salePrice: p.discountPrice ? Number(p.discountPrice) : null,
    slug: String(p.id), // Chuyển slug thành ID chuỗi để đồng bộ router [id]
    category: p.category ? (p.category.categoryName || p.category.name || p.category) : "Chưa phân loại",
    category_id: p.category?.id || p.categoryId,
    availability: p.availability,
    description: p.description,
    images: [finalImageUrl],
    thumbnail: finalImageUrl,
    attributes: p.attributes || []
  };
};

/**
 * Lấy danh sách sản phẩm mới
 * Spring Boot mới chỉ có /catalog/products, ta lấy toàn bộ rồi lọc/sắp xếp tại client hoặc dùng API nếu có sau này
 */
export const getNewProducts = async (limit = 10) => {
  try {
    const res = await api.get("catalog/products");
    const products = (res.data || []).map(formatProduct);
    return products.slice(0, limit);
  } catch (err) {
    console.error("❌ Lỗi lấy sản phẩm mới:", err);
    return [];
  }
};

/**
 * Lấy danh sách sản phẩm khuyến mãi
 */
export const getSaleProducts = async (limit = 10) => {
  try {
    const res = await api.get("catalog/products");
    const products = (res.data || [])
      .filter(p => p.discountPrice && p.discountPrice > 0)
      .map(formatProduct);
    return products.slice(0, limit);
  } catch (err) {
    console.error("❌ Lỗi lấy sản phẩm khuyến mãi:", err);
    return [];
  }
};

/**
 * Lấy sản phẩm theo danh mục
 */
export const getProductsByCategory = async (categoryId, limit = 8) => {
  try {
    const res = await api.get("catalog/products", { params: { categoryId } });
    return (res.data || []).map(formatProduct).slice(0, limit);
  } catch (err) {
    console.error("❌ Lỗi lấy sản phẩm theo categoryId:", err);
    return [];
  }
};

/**
 * Lấy chi tiết sản phẩm theo ID (Thay thế slug bằng ID nếu backend chưa hỗ trợ slug)
 */
export const getProductById = async (id) => {
  try {
    const res = await api.get(`catalog/products/${id}`);
    return formatProduct(res.data);
  } catch (err) {
    console.error("❌ Lỗi lấy chi tiết sản phẩm:", err);
    return null;
  }
};

export const searchProducts = async (name) => {
  try {
    const res = await api.get("catalog/products/search", { params: { name } });
    return (res.data || []).map(formatProduct);
  } catch (err) {
    console.error("❌ Lỗi tìm kiếm sản phẩm:", err);
    return [];
  }
};

export const getAllProducts = async (limit = 50) => {
  try {
    const res = await api.get("catalog/products");
    return (res.data || []).map(formatProduct).slice(0, limit);
  } catch (err) {
    console.error("❌ Lỗi lấy tất cả sản phẩm:", err);
    return [];
  }
};