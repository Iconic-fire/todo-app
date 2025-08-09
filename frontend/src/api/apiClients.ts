import { Configuration, AccountsApi, TodosApi } from "../client";
import { axiosInstance, plainAxios } from "./axiosConfig";

const config = new Configuration();

export const unauthenticatedAccountsApi = new AccountsApi(config, undefined, plainAxios);
export const accountsApi = new AccountsApi(config, undefined, axiosInstance);
export const todoApi = new TodosApi(config, undefined, axiosInstance);
