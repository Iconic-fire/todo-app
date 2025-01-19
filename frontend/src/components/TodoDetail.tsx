import { Todo } from "../client";
import DateInfo from "./Date";

function DetailModal({
  todo,
  closeHandler,
}: {
  todo: Todo;
  closeHandler: (event: React.MouseEvent) => void;
}) {
  let scheduledAt: Date | undefined;
  const createdAt = new Date(todo.created_at);
  if (todo.due_date) {
    scheduledAt = new Date(todo.due_date);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full overflow-x-hidden overflow-y-auto bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {todo.title}
            </h3>
            <button
              onClick={closeHandler}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close Todo Detail</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {todo.description}
            </p>
          </div>
          {/* Modal footer */}
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 text-slate-300 gap-x-2 justify-between">
            <div>
              <p>Status: {todo.is_completed ? "☑️" : "🕓"}</p>
              {scheduledAt && <DateInfo date={scheduledAt} prefixText={"scheduled"} />}
            </div>
            <DateInfo
              date={createdAt}
              prefixText={"created"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
