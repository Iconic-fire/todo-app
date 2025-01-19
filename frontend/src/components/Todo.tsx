import { useState } from "react";
import { Todo as TodoObj } from "../client";
import DetailModal from "./TodoDetail";
import Confirmation from "./Confirmation";

function Todo({
  todo,
  onDelete,
}: {
  todo: TodoObj;
  onDelete: (id: number) => void;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  function openDetail() {
    setShowDetail(true);
  }

  function closeDetail() {
    setShowDetail(false);
  }

  function deleteClickHandler() {
    setShowDeleteConfirmation(true);
  }

  function closeDeleteConfirmation() {
    setShowDeleteConfirmation(false);
  }

  return (
    <li>
      <div className="p-2 cursor-pointer flex flex-row gap-2 items-center justify-between rounded-xl border-2 border-green-700 bg-green-500/30 hover:bg-green-700">
        <div className="flex flex-col gap-1 overflow-hidden">
          <h1 className="text-lg text-white">{todo.title}</h1>
          <p className="truncate text-slate-300">{todo.description}</p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {/* TODO: Create Single component for button */}
          {/* Delete button */}
          {/* TODO: change color and show confirmation before delete */}
          <button
            onClick={deleteClickHandler}
            className="bg-transparent hover:bg-red-300 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          >
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
            <span className="sr-only">Delete Todo</span>
          </button>
          {/* Detail button */}
          <button onClick={openDetail}>
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white hover:text-gray-900 dark:hover:text-slate-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
              />
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <span className="sr-only">View Todo Detail</span>
          </button>
        </div>
      </div>
      {showDetail && <DetailModal todo={todo} closeHandler={closeDetail} />}
      <Confirmation isVisible={showDeleteConfirmation} onClose={closeDeleteConfirmation} onConfirm={() => onDelete(todo.id)}/>
    </li>
  );
}

export default Todo;
