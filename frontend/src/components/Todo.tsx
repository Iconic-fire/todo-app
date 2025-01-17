import { Todo as TodoObj } from "../client";

function DateInfo({
  prefixText,
  date,
}: {
  prefixText: "scheduled" | "created";
  date: Date;
}) {
  return (
    <span className="shrink-0 text-xs self-end italic">
      {prefixText} at {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </span>
  );
}

function Todo({
  todo,
  onDelete,
}: {
  todo: TodoObj;
  onDelete: (id: number) => void;
}) {
  let scheduledAt: Date | undefined;
  const createdAt = new Date(todo.created_at);
  if (todo.due_date) {
    scheduledAt = new Date(todo.due_date);
  }

  return (
    <li className="p-2 rounded-xl border-2 border-green-700 bg-green-500/30 hover:bg-green-700">
      <h1 className="text-lg text-white">{todo.title}</h1>
      <p className="truncate text-slate-300">{todo.description}</p>
      <div className="flex text-slate-300 gap-x-3">
        <span className="text-xl">{todo.is_completed ? "☑️" : "🕓"}</span>
        <button onClick={() => onDelete(todo.id)}>
          <svg
            className="w-[24px] h-[24px] text-red-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
            />
          </svg>
        </button>
        <DateInfo
          date={scheduledAt ? scheduledAt : createdAt}
          prefixText={scheduledAt ? "scheduled" : "created"}
        />
      </div>
    </li>
  );
}

export default Todo;
