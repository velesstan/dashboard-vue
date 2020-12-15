import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API,
});

const access_token = localStorage.getItem("access_token");
if (access_token) {
  api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
} else {
  api.defaults.headers.common.Authorization = null;
}

export default api;
