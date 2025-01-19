import { useState, useEffect } from "react";
import "./App.css";
import todoApi from "./api";
import { Todo as TodoObj } from "./client";
import Todo from "./components/Todo";
import CreateTodoForm, { CreateTodoPayload } from "./components/Form";

function App() {
  const [todos, setTodos] = useState<TodoObj[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [failed, setFailed] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  function closeCreateForm() {
    setShowCreateForm(false);
  }
  
  function openCreateForm() {
    setShowCreateForm(true);
  }

  function deleteHandler(id: number) {
    todoApi.todosDestroy(id).then(() => {
      setTodos(todos.filter((todo) => todo.id !== id));
    });
  }

  function updateComplete(id: number, isCompleted: boolean) {
    todoApi.todosPartialUpdate(id, { is_completed: isCompleted }).then(() => {
      const updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, is_completed: isCompleted };
        }
        return todo;
      });
      console.log(updatedTodos, updatedTodos);
      setTodos(updatedTodos);
    });
  }

  function createTodo(payload: CreateTodoPayload) {
    // TODO: remove this once client is fixed
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    todoApi.todosCreate(payload).then((res) => {
      // TODO: move newly created todo to the top on api order by descending by id
      setTodos([...todos, res.data]);
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
      <button onClick={openCreateForm} type="button" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Create Todo</button>
      <ul className="w-full md:w-1/2 flex flex-col gap-y-2">
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} markAsComplete={() => updateComplete(todo.id, true)} onDelete={() => deleteHandler(todo.id)} markAsIncomplete={() => updateComplete(todo.id, false)} />
        ))}
      </ul>
      <CreateTodoForm isVisible={showCreateForm} onClose={closeCreateForm} onSubmit={createTodo} />
    </div>
  );
}

export default App;
