// app/(site)/api/apiBanner.js
import axios from "axios";
import { API_URL, IMAGE_URL } from "../../config";

const api = axios.create({
  baseURL: API_URL,
});

export const getBanners = async () => {
  try {
    const res = await api.get("banner/banners-slideshow");
    return (res.data || []).map(b => {
      let cleanImage = b.image || "";
      if (cleanImage.startsWith("images/")) {
        cleanImage = cleanImage.replace("images/", "");
      }
      return {
        ...b,
        image: cleanImage ? (cleanImage.startsWith('http') ? cleanImage : `${IMAGE_URL}${cleanImage.replace(/^\/+/, "")}`) : null
      };
    });
  } catch (error) {
    console.error("❌ Error fetching banners:", error);
    return [];
  }
};

export const getBannerById = async (id) => {
  const res = await api.get(`banner/banner/${id}`);
  return res.data;
};

export const createBanner = async (bannerData) => {
  const res = await api.post("banner/banner", bannerData);
  return res.data;
};
