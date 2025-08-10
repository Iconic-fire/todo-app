import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow-md text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-2">
          Page Not Found
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
