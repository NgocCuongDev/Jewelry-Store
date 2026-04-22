import axiosServer from "./axiosServer";

const apiBanner = {
  getSlideshowBanners: () => {
    return axiosServer.get('/banner/banners-slideshow');
  },
  getBannerById: (id) => {
    return axiosServer.get(`/banner/banner/${id}`);
  },
  addBanner: (bannerData) => {
    return axiosServer.post('/banner/banner', bannerData);
  },
  updateBanner: (id, bannerData) => {
    return axiosServer.put(`/banner/banner/${id}`, bannerData);
  },
  deleteBanner: (id) => {
    return axiosServer.delete(`/banner/banner/${id}`);
  },
  uploadImage: (formData) => {
    return axiosServer.post('/banner/banner-images-api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default apiBanner;
