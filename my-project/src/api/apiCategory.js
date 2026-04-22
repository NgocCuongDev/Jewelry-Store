import axiosServer from "./axiosServer";

const apiCategory = {
  getAllCategories: () => {
    return axiosServer.get('/catalog/categories');
  },
  getCategoryById: (id) => {
    return axiosServer.get(`/catalog/categories/${id}`);
  },
  addCategory: (categoryData) => {
    return axiosServer.post('/catalog/categories', categoryData);
  },
  updateCategory: (id, categoryData) => {
    return axiosServer.put(`/catalog/categories/${id}`, categoryData);
  },
  deleteCategory: (id) => {
    return axiosServer.delete(`/catalog/categories/${id}`);
  }
}

export default apiCategory;
