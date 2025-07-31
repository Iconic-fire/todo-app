import { Configuration, AccountsApi, TodosApi } from "./client";

// TODO: base url must be come from enticement variable
const config = new Configuration({ basePath: "http://127.0.0.1:8000" })

export const accountsApi = new AccountsApi(config)
export const todoApi = new TodosApi(config);
