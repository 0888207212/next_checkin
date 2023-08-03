import axiosInstance from "./axios-instance";

const apiAttendences = {
  getAttendencesManagementForAdmin(params) {
    const url = "/admin/attendances";
    return axiosInstance.get(url, { params });
  },
  getAttendencesUser(params) {
    const url = "/user/checkins";
    return axiosInstance.get(url, { params });
  },
  exportExcel(params) {
    const url = "/export";
    return axiosInstance.get(url, { params, responseType: "blob" });
  },
};

export default apiAttendences;
