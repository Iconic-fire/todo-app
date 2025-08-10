import axios, { AxiosRequestConfig } from "axios";
import { getAccessToken } from "../auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const TOKEN_PREFIX = "Bearer";

export const defaultAxiosConfig: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
    withCredentials: true,
};

export const plainAxios = axios.create(defaultAxiosConfig);

export const axiosInstance = axios.create(defaultAxiosConfig);

export const setAuthorizationHeader = (config: any) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `${TOKEN_PREFIX} ${token}`;
    }
    return config;
};
