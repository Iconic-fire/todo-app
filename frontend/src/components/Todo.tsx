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

function Todo({ todo }: { todo: TodoObj }) {
  let scheduledAt: Date | undefined;
  const createdAt = new Date(todo.created_at);
  if (todo.due_date) {
    scheduledAt = new Date(todo.due_date);
  }

  return (
    <li className="p-2 rounded-xl border-2 border-green-700 bg-green-500/30 hover:bg-green-700">
      <h1 className="text-lg text-white">{todo.title}</h1>
      <p className="truncate text-slate-300">{todo.description}</p>
      <div className="flex justify-between text-slate-300 gap-x-3">
        <span>{todo.is_completed ? "✅" : "🕓"}</span>
        <DateInfo
          date={scheduledAt ? scheduledAt : createdAt}
          prefixText={scheduledAt ? "scheduled" : "created"}
        />
      </div>
    </li>
  );
}

export default Todo;
