import axiosServer from "./axiosServer";

const apiMenu = {
  getAllMenus: () => {
    return axiosServer.get('/menu/menus');
  },
  addMenu: (menuData) => {
    return axiosServer.post('/menu/menus', menuData);
  },
  updateMenu: (id, menuData) => {
    return axiosServer.put(`/menu/menus/${id}`, menuData);
  },
  deleteMenu: (id) => {
    return axiosServer.delete(`/menu/menus/${id}`);
  }
}

export default apiMenu;
