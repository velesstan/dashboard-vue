import axios from 'axios';

const DEV_URL = location.protocol + '//' + location.hostname + ':3000';

const api = axios.create({
  baseURL: process.env.VUE_APP_API || DEV_URL
});

export default api;
