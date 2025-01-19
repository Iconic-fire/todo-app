import { useState } from "react";
import { Todo as TodoObj } from "../client";
import DetailModal from "./TodoDetail";
import Confirmation from "./Confirmation";

interface TodoProps {
  todo: TodoObj;
  onDelete: () => void;
  markAsComplete: () => void;
}

function Todo({
  todo,
  onDelete,
  markAsComplete
}: TodoProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showMarkAsDeleteConfirmation, setShowMarkAsDeleteConfirmation] = useState(false);

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

  function markAsCompleteClickHandler() {
    setShowMarkAsDeleteConfirmation(true);
  }

  function closeMarkAsCompleteConfirmation() {
    setShowMarkAsDeleteConfirmation(false);
  }

  function markAsCompleteHandler() {
    markAsComplete();
    setShowMarkAsDeleteConfirmation(false);
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
          {/* Mask as complete button */}
          {!todo.is_completed && <button onClick={markAsCompleteClickHandler}>
            <svg className="w-6 h-6 text-gray-800 dark:text-white dark:hover:text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 1 0-18c1.052 0 2.062.18 3 .512M7 9.577l3.923 3.923 8.5-8.5M17 14v6m-3-3h6"/>
            </svg>
          </button>}
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
      <Confirmation actionText={"delete"} isVisible={showDeleteConfirmation} onClose={closeDeleteConfirmation} onConfirm={onDelete}/>
      <Confirmation actionText={"mark as complete"} isVisible={showMarkAsDeleteConfirmation} onClose={closeMarkAsCompleteConfirmation} onConfirm={markAsCompleteHandler}/>
    </li>
  );
}

export default Todo;
