import axios, { AxiosInstance } from 'axios';

const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL
});

const attachToken = async (config) => {
  try {
    const accessToken = await localStorage.getItem('access-token');
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch (e) {
  }
  return config;
}

httpClient.interceptors.request.use(
  (config) => Promise.resolve(attachToken(config)),
  error => Promise.reject(error)
);


// Response interceptor
httpClient.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default httpClient;
