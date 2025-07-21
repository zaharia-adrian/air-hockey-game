import Axios from 'axios';
import Cookies from 'js-cookie'

const url = 'http://localhost:8000';

const axios = Axios.create({});

axios.defaults.timeout = 120000;

axios.interceptors.request.use(
  async function (config) {
    
    const username = Cookies.get('username');
    const token = Cookies.get('jwt');

    if (username && token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Access-Control-Allow-Credentials"] = true;
    }
    config.headers["Content-Type"] = "application/json";
    config.baseURL = url;
    config.withCredentials = true

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error?.response?.status === 403) {
    }
    if (error?.response?.status === 401) {
    }
    throw error; 
  }
);

export default axios;