import { useState, useEffect } from "react";
import { todoApi } from "../api";
import { PatchedTodo, Todo as TodoObj } from "../client";
import { CreateTodoForm, CreateTodoPayload } from "../components";
import { TodoList } from "../components";
import { NoRecordFound } from "../components";

function Home() {
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

  function updateTodoHandler(id: number, payload: PatchedTodo) {
    todoApi.todosPartialUpdate(id, payload).then(() => {
      const updatedTodos = todos
        .map((todo) => {
          if (todo.id === id) {
            return { ...todo, ...payload };
          }
          return todo;
        })
        // Move the updated todo to the top
        .sort((a, b) => (a.id === id ? -1 : b.id === id ? 1 : 0));

      setTodos(updatedTodos);
    });
  }

  function createTodo(payload: CreateTodoPayload) {
    // TODO: remove this once client is fixed
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    todoApi.todosCreate(payload).then((res) => {
      // move newly created todo to the top
      setTodos([res.data, ...todos]);
    });
  }

  useEffect(() => {
    todoApi
      .todosList()
      .then((res) => setTodos(res.data.results))
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

  return (
    <div className="h-svh p-4 md:p-10 flex flex-col gap-y-10 items-center bg-stone-800">
      <h1 className="text-white text-3xl underline">Your Todo's</h1>
      <button
        onClick={openCreateForm}
        type="button"
        className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
      >
        Create Todo
      </button>
      {todos.length > 0 ? (
        <TodoList
          todos={todos}
          deleteHandler={deleteHandler}
          updateTodoHandler={updateTodoHandler}
        />
      ) : (
        <NoRecordFound />
      )}
      <CreateTodoForm
        isVisible={showCreateForm}
        onClose={closeCreateForm}
        onSubmit={createTodo}
      />
    </div>
  );
}

export default Home;
