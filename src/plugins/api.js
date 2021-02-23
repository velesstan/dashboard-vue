import axios from "axios";

const DEV_URL = location.protocol + '//' + location.hostname + ':3000';

export const API_URL = process.env.VUE_APP_API || DEV_URL;

const api = axios.create({
  baseURL: process.env.VUE_APP_API || DEV_URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.url === "/api/auth/refreshToken"
    ) {
      // router redirect
      return Promise.reject(error);
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return api.post("/api/auth/refreshToken").then((res) => {
        if (res.status === 201) {
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh_token);
          api.defaults.headers.common["Authorization"] =
            "Bearer " + localStorage.getItem('access_token');
          return api(originalRequest);
        }
      });
    }
    return Promise.reject(error);
  }
);
export default api;
