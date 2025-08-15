import axios, { AxiosInstance } from 'axios';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL
});

const attachToken = async (config: any) => {
  const accessToken = localStorage.getItem('access-token');
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

httpClient.interceptors.request.use(
  (config) => Promise.resolve(attachToken(config)),
  error => Promise.reject(error)
);

httpClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = 'Bearer ' + token;
              resolve(httpClient(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            }
          });
        });
      }

      isRefreshing = true;
      const refreshToken = localStorage.getItem('refresh-token');

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_BASE_URL}/auth/refresh`,
          { refresh: refreshToken }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem('access-token', newAccessToken);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return httpClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Optionally logout user here
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
