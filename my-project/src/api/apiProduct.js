import axiosServer from "./axiosServer";

const apiProduct = {
  getAllProducts: () => {
    return axiosServer.get('/catalog/products');
  },
  getProductById: (id) => {
    return axiosServer.get(`/catalog/products/${id}`);
  },
  addProduct: (productData) => {
    return axiosServer.post('/catalog/products', productData);
  },
  updateProduct: (id, productData) => {
    return axiosServer.put(`/catalog/products/${id}`, productData);
  },
  deleteProduct: (id) => {
    return axiosServer.delete(`/catalog/products/${id}`);
  },
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosServer.post('/catalog/product-images-api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getAllCategories: () => {
    return axiosServer.get('/catalog/categories');
  }
}

export default apiProduct;