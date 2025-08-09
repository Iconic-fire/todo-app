import { useState } from "react";
import { unauthenticatedAccountsApi } from "../api";
import { Link } from "react-router";

function ResetPassword() {
  const [email, setEmail] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await unauthenticatedAccountsApi.accountsPasswordResetCreate({
        email,
      });

      // Reset form fields
      setEmail('');
      setSuccessMessage(response.data.message);
    } catch (err: any) {
      // Network error or no response
      if (!err.response) {
        setError("Network error. Please try again later.");
        setLoading(false);
        return;
      }
      setError(err.response.data.error || "failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-svh bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          Reset your password
        </h2>

        {successMessage && (
          <div className="text-green-600 bg-green-100 p-4 rounded-lg mb-4">{successMessage}</div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 dark:bg-red-200 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-4 text-sm flex justify-center gap-1">
          <p className="text-gray-600 dark:text-gray-400">Go back to </p>
          <Link className="text-blue-600 hover:underline dark:text-blue-400 cursor-pointer" to="/login">
            Login
          </Link>
        </div>

        <div className="mt-2 text-sm flex justify-center gap-1">
          <p className="text-gray-600 dark:text-gray-400">Don't have an account?</p>
          <Link className="text-blue-600 hover:underline dark:text-blue-400 cursor-pointer" to="/signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;