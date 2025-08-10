import { useState } from "react";
import { PatchedTodo, Todo as TodoObj } from "../client";
import { DetailModal } from "./TodoDetail";
import { Confirmation } from "./Confirmation";
import { UpdateTodoForm } from "./form/UpdateForm";

interface TodoProps {
  todo: TodoObj;
  onDelete: () => void;
  updateTodo: (payload: PatchedTodo) => void;
}

export function Todo({ todo, onDelete, updateTodo }: TodoProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showMarkAsCompleteConfirmation, setShowMarkAsCompleteConfirmation] =
    useState(false);
  const [
    showMarkAsIncompleteConfirmation,
    setShowMarkAsIncompleteConfirmation,
  ] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

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
    setShowMarkAsCompleteConfirmation(true);
  }

  function closeMarkAsCompleteConfirmation() {
    setShowMarkAsCompleteConfirmation(false);
  }

  function markAsCompleteHandler() {
    updateTodo({ is_completed: true });
    setShowMarkAsCompleteConfirmation(false);
  }

  function markAsIncompleteClickHandler() {
    setShowMarkAsIncompleteConfirmation(true);
  }

  function closeMarkAsIncompleteConfirmation() {
    setShowMarkAsIncompleteConfirmation(false);
  }

  function markAsIncompleteHandler() {
    updateTodo({ is_completed: false });
    setShowMarkAsIncompleteConfirmation(false);
  }

  function editClickHandler() {
    setShowUpdateForm(true);
  }

  function closeUpdateForm() {
    setShowUpdateForm(false);
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
          {!todo.is_completed ? (
            <button onClick={markAsCompleteClickHandler}>
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white dark:hover:text-yellow-400"
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
                  d="M12 21a9 9 0 1 1 0-18c1.052 0 2.062.18 3 .512M7 9.577l3.923 3.923 8.5-8.5M17 14v6m-3-3h6"
                />
              </svg>
            </button>
          ) : (
            <button onClick={markAsIncompleteClickHandler}>
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white dark:hover:text-yellow-400"
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
                  d="M12 8v4l3 3M3.22302 14C4.13247 18.008 7.71683 21 12 21c4.9706 0 9-4.0294 9-9 0-4.97056-4.0294-9-9-9-3.72916 0-6.92858 2.26806-8.29409 5.5M7 9H3V5"
                />
              </svg>
            </button>
          )}
          {/* Update button */}
          <button onClick={editClickHandler}>
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
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
                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
              />
            </svg>
            <span className="sr-only">Update Todo Detail</span>
          </button>
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
      <Confirmation
        actionText={"delete"}
        isVisible={showDeleteConfirmation}
        onClose={closeDeleteConfirmation}
        onConfirm={onDelete}
      />
      {todo.is_completed ? (
        <Confirmation
          actionText={"mark as incomplete"}
          isVisible={showMarkAsIncompleteConfirmation}
          onClose={closeMarkAsIncompleteConfirmation}
          onConfirm={markAsIncompleteHandler}
        />
      ) : (
        <Confirmation
          actionText={"mark as complete"}
          isVisible={showMarkAsCompleteConfirmation}
          onClose={closeMarkAsCompleteConfirmation}
          onConfirm={markAsCompleteHandler}
        />
      )}
      <UpdateTodoForm
        todo={todo}
        isVisible={showUpdateForm}
        onSubmit={updateTodo}
        onClose={closeUpdateForm}
      />
    </li>
  );
}
