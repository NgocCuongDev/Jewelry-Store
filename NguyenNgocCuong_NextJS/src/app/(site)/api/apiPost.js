// app/(site)/api/apiPost.js
import axios from "axios";
import { API_URL, IMAGE_URL } from "../../config";

const api = axios.create({
  baseURL: API_URL,
});

export const getPosts = async () => {
  try {
    const res = await api.get("post/all-posts");
    return (res.data || []).map(p => {
      let cleanThumb = p.thumbnail || "";
      if (cleanThumb.startsWith("images/")) {
        cleanThumb = cleanThumb.replace("images/", "");
      }
      return {
        ...p,
        thumbnail: cleanThumb ? (cleanThumb.startsWith('http') ? cleanThumb : `${IMAGE_URL}${cleanThumb.replace(/^\/+/, "")}`) : null
      };
    });
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return [];
  }
};

export const getPostBySlug = async (slug) => {
  try {
    const res = await api.get(`post/post/slug/${slug}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching post by slug:", error);
    return null;
  }
};

export const getPostById = async (id) => {
  const res = await api.get(`post/post/${id}`);
  return res.data;
};