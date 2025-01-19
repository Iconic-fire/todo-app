import { useState } from "react";

export interface CreateTodoPayload {
    title: string;
    description?: string;
    scheduleOn?: string; 
}

interface CreateTodoFormProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (formData: CreateTodoPayload) => void;
  }

function CreateTodoForm({isVisible, onClose, onSubmit }: CreateTodoFormProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        scheduleOn: "",
    });

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Form Submitted:", formData);
        onSubmit(formData)

        // Reset form fields
        setFormData({
            title: "",
            description: "",
            scheduleOn: "",
        });
  
        onClose();
    };

    if (!isVisible) return null;

    return <div
    id="crud-modal"
    tabIndex={-1}
    aria-hidden={!isVisible}
    className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
  >
    <div className="relative p-4 w-full max-w-md max-h-full">
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create New Todo
          </h3>
          <button
            type="button"
            onClick={onClose}
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
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Modal Body */}
        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Enter the title"
              required
            />
          </div>

          {/* Description Textarea */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your description here"
            ></textarea>
          </div>

          {/* Schedule On Input */}
          <div className="mb-4">
            <label
              htmlFor="scheduleOn"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Schedule On
            </label>
            <input
              type="datetime-local"
              name="scheduleOn"
              id="scheduleOn"
              value={formData.scheduleOn}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="text-white mr-1 inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create Todo
          </button>
        </form>
      </div>
    </div>
  </div>;
}

export default CreateTodoForm;
