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
  exportExcel(payload) {
    const url = "/export";
    return axiosInstance.post(url, payload, { responseType: "blob" });
  },
  getDetailAttendences(id) {
    const url = `/user/checkin/${id}`;
    return axiosInstance.get(url);
  },
};

export default apiAttendences;
