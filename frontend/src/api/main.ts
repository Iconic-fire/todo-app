import {API_BASE_URL, axiosInstance} from "./axios";
import { Configuration, AccountsApi, TodosApi } from "./client";

const config = new Configuration({ basePath: API_BASE_URL });

export const accountsApi = new AccountsApi(config);
export const todoApi = new TodosApi(config,  undefined, axiosInstance);
