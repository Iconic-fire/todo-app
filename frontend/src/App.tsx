import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { TodosApi, Configuration, Todo } from "./client";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = new TodosApi(
          new Configuration({ basePath: "http://127.0.0.1:8000" })
        );
        const response = await api.todosList();
        setTodos(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  return (
    <div className="h-svh grid place-items-center bg-stone-800">
      <h1 className="text-3xl">Todo App</h1>
    </div>
  );
}

export default App;
