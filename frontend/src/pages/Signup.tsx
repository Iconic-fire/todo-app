import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { accountsApi } from "../api";
import { useAuth } from "../auth";

function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // if already logged in navigate to index page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }


    try {
      await accountsApi.accountsSignupCreate({
        email,
        password,
        password2: confirmPassword,
      });

      // Reset form fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSuccessMessage('Signup successful! Please check your email to verify and activate your account.');
    } catch (err: any) {
      // Network error or no response
      if (!err.response) {
        setError("Network error. Please try again later.");
        setLoading(false);
        return;
      }

      // Handle form-specific errors
      if (err.response.data?.email || err.response.data?.password) {
        if (err.response.data.email) {
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            email: err.response.data.email[0],
          }));
        }

        if (err.response.data.password) {
          setFieldErrors((prevErrors) => ({
            ...prevErrors,
            password: err.response.data.password[0],
          }));
        }
      } else {
        setError(err.response.data.non_field_errors[0] || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-svh bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          Sign up for an account
        </h2>

        {successMessage && (
          <div className="text-green-600 bg-green-100 p-4 rounded-lg mb-4">{successMessage}</div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 dark:bg-red-200 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
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
            {fieldErrors.email && <span className="text-sm text-red-500">{fieldErrors.email}</span>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.password && <span className="text-sm text-red-500">{fieldErrors.password}</span>}
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
            {fieldErrors.password2 && <span className="text-sm text-red-500">{fieldErrors.password2}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-sm flex justify-center gap-1">
          <p className="text-gray-600 dark:text-gray-400">Already have an account?</p>
          <Link className="text-blue-600 hover:underline dark:text-blue-400 cursor-pointer" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;