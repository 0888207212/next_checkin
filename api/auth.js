import axiosInstance from "./axios-instance";

const apiAuth = {
  getUser() {
    const url = "/auth/get_info_by_token";
    return axiosInstance.get(url);
  },
  login(payload) {
    const url = "/auth/google_login";
    return axiosInstance.post(url, payload);
  },
  logout() {
    const url = "/auth/logout";
    return axiosInstance.post(url);
  },
  listUser() {
    const url = "/users";
    return axiosInstance.get(url);
  },
};

export default apiAuth;
