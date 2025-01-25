import { PatchedTodo, Todo as TodoObj } from "../client";
import Todo from "./Todo";

interface TodoListProps {
  todos: TodoObj[];
  deleteHandler: (id: number) => void;
  updateTodoHandler: (id: number, payload: PatchedTodo) => void;
}

function TodoList({ todos, deleteHandler, updateTodoHandler }: TodoListProps) {
  return (
    <ul className="w-full md:w-1/2 flex flex-col gap-y-2">
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          onDelete={() => deleteHandler(todo.id)}
          updateTodo={(payload: PatchedTodo) =>
            updateTodoHandler(todo.id, payload)
          }
        />
      ))}
    </ul>
  );
}

export default TodoList;
