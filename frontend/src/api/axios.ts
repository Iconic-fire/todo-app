import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, removeTokens, setAccessToken } from "../auth/utils";
import { redirectToLogin } from "../auth/redirects";

const TOKEN_PREFIX = "Bearer";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

type FailedRequest = {
    resolve: (token: string) => void;
    reject: (err: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
};

const axiosInstance = axios.create();
axios.defaults.withCredentials = true;

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        config.headers.Authorization = `${TOKEN_PREFIX} ${accessToken}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Token expired, and we're not retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // Queue up requests while refreshing
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `${TOKEN_PREFIX} ${token}`;
                            resolve(axiosInstance(originalRequest));
                        },
                        reject: (err: any) => reject(err),
                    });
                });
            }

            isRefreshing = true;

            try {
                const response = await axios.post(
                    `${API_BASE_URL}/api/accounts/refresh/`,
                    null,
                    { withCredentials: true }
                );
                const { token: newAccessToken } = response.data;
                setAccessToken(newAccessToken);
                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `${TOKEN_PREFIX} ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                removeTokens();
                redirectToLogin();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export { axiosInstance, API_BASE_URL };
