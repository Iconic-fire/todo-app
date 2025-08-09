import { useState } from "react";
import { unauthenticatedAccountsApi } from "../api";

function PasswordChange() {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    setLoading(true);

    try {
      const response = await unauthenticatedAccountsApi.accountsChangePasswordCreate({
        old_password: oldPassword,
        new_password: password,
        new_password2: confirmPassword,
      });

      // Reset form fields
      setOldPassword('');
      setPassword('');
      setConfirmPassword('');
      setSuccessMessage(response.data.message);
    } catch (err: any) {
      // Network error or no response
      if (!err.response) {
        setError("Network error. Please try again later.");
        setLoading(false);
        return;
      }

      // Handle form-specific errors
      if (err.response.data?.old_password || err.response.data?.new_password) {
        if (err.response.data.old_password) {
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            old_password: err.response.data.old_password[0],
          }));
        }

        if (err.response.data.new_password) {
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            new_password: err.response.data.new_password[0],
          }));
        }
      } else {
        setError(err.response.data.non_field_errors[0] || "failed to change password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-svh bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          Change your password
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
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.old_password && <span className="text-sm text-red-500">{fieldErrors.old_password}</span>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.new_password && <span className="text-sm text-red-500">{fieldErrors.new_password}</span>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.new_password2 && <span className="text-sm text-red-500">{fieldErrors.new_password2}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? "Changing password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordChange;