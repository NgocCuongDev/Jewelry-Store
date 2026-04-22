import axiosServer from "./axiosServer";

const apiPost = {
  getAllPosts: () => {
    return axiosServer.get('/post/all-posts');
  },
  getPostById: (id) => {
    return axiosServer.get(`/post/post/${id}`);
  },
  addPost: (postData) => {
    return axiosServer.post('/post/post', postData);
  },
  updatePost: (id, postData) => {
    return axiosServer.put(`/post/post/${id}`, postData);
  },
  deletePost: (id) => {
    return axiosServer.delete(`/post/post/${id}`);
  },
  uploadImage: (formData) => {
    return axiosServer.post('/post/post-images-api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default apiPost;
