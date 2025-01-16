import { Configuration, TodosApi } from "./client";

const todoApi = new TodosApi(
  // TODO: base url must be come from enticement variable
  new Configuration({ basePath: "http://127.0.0.1:8000" })
);

export default todoApi;
