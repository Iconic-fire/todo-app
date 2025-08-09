import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "../auth/tokenStore";
import { redirectToLogin } from "../auth/redirects";

const TOKEN_PREFIX = "Bearer";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

type FailedRequest = {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

const plainAxios = axios.create({
  // baseURL: API_BASE_URL,
  // withCredentials: true,
});
plainAxios.defaults.withCredentials = true;


const axiosInstance = axios.create({
  // baseURL: API_BASE_URL,
  // withCredentials: true,
});
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `${TOKEN_PREFIX} ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (err.response?.status === 401 && !originalRequest?._retry) {
      // mark retry so we don't infinite-loop
      originalRequest._retry = true;

      if (isRefreshing) {
        // queue request until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `${TOKEN_PREFIX} ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // call refresh endpoint using plainAxios so this request doesn't use Authorization header
        // The server should read the HttpOnly refresh cookie and return a new access token (and optionally a new refresh cookie)
        const refreshResponse = await plainAxios.post("/api/accounts/refresh/", null);
        const newAccess = refreshResponse.data?.access;

        if (!newAccess) {
          throw new Error("No access token in refresh response");
        }

        setAccessToken(newAccess);
        processQueue(null, newAccess);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `${TOKEN_PREFIX} ${newAccess}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setAccessToken(null);
        // Redirect to login SPA style
        redirectToLogin();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export {axiosInstance, plainAxios, API_BASE_URL };
