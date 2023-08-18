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
  getDetailAttendencesAdmin(id) {
    const url = `admin/attendances/checkin/${id}`;
    return axiosInstance.get(url);
  },
  requestTimeUser(payload) {
    const url = "/request_time";
    return axiosInstance.post(url, payload);
  },
  getRequestTimeUser(params) {
    const url = "/request_time";
    return axiosInstance.get(url, { params });
  },
  putRequestTime(id, payload) {
    const url = `/request_time/change-status/${id}`;
    return axiosInstance.put(url, payload);
  },
  explainPosition(id, payload) {
    const url = `/explain-position/${id}`;
    return axiosInstance.put(url, payload);
  }
};

export default apiAttendences;
