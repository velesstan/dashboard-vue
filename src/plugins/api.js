import axios from "axios";

const DEV_URL = location.protocol + '//' + location.hostname + ':3000';

const api = axios.create({
  baseURL: process.env.VUE_APP_API || DEV_URL
});

const access_token = localStorage.getItem("access_token");
if (access_token) {
  api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
} else {
  api.defaults.headers.common.Authorization = null;
}

export default api;
