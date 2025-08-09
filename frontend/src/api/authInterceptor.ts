import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { setAccessToken } from "../auth/tokenStore";
import { redirectToLogin } from "../auth/redirects";
import { AccountsApi, Configuration } from "../client";
import { TOKEN_PREFIX, axiosInstance, setAuthorizationHeader } from "./axiosConfig";

const unauthenticatedAccountsApi = new AccountsApi(new Configuration(), undefined, axiosInstance);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    if (!token) {
        console.error("Failed request due to error:", error);
    }

    failedQueue.forEach(prom => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return setAuthorizationHeader(config);
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // queue request until refresh finishes
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `${TOKEN_PREFIX} ${token}`;
                            resolve(axiosInstance(originalRequest));
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                const response = await unauthenticatedAccountsApi.accountsRefreshCreate();
                const newAccessToken = response.data.access;
                setAccessToken(newAccessToken);
                processQueue(null, newAccessToken);
                originalRequest.headers.Authorization = `${TOKEN_PREFIX} ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (err: any) {
                processQueue(err, null);
                setAccessToken(null);
                redirectToLogin();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        } else if (!error.response) {
            // Handle cases when the error does not have a response (e.g., network errors)
            console.error("Network error or server unreachable:", error);
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);
