import { useState, useEffect } from "react";
import "./App.css";
import todoApi from "./api";
import { Todo as TodoObj } from "./client";
import Todo from "./components/Todo";

function App() {
  const [todos, setTodos] = useState<TodoObj[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [failed, setFailed] = useState<boolean>(false);

  function deleteHandler(id: number) {
    todoApi.todosDestroy(id).then(() => {
      setTodos(todos.filter((todo) => todo.id !== id));
    });
  }

  useEffect(() => {
    todoApi
      .todosList()
      .then((res) => setTodos(res.data))
      .catch(() => {
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading === true) {
    return <h1>Loading ...</h1>;
  }

  if (failed === true) {
    // TODO: add retry button
    return <h1>Unable to fetch</h1>;
  }

  // TODO: add empty state
  return (
    <div className="h-svh p-4 md:p-10 flex flex-col gap-y-10 items-center bg-stone-800">
      <h1 className="text-white text-3xl underline">Your Todo's</h1>
      <ul className="w-full md:w-1/2 flex flex-col gap-y-2">
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} onDelete={deleteHandler} />
        ))}
      </ul>
    </div>
  );
}

export default App;
