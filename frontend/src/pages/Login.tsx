import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getRefreshToken, isTokenExpired, setAccessToken, setRefreshToken } from "../auth/utils";
import { accountsApi } from "../api/main";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getRefreshToken();
    if (token && !isTokenExpired(token)) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await accountsApi.accountsLoginCreate({
        email,
        password,
      });
      const { access, refresh } = response.data.tokens;
      setAccessToken(access);
      setRefreshToken(refresh);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-svh bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          Sign in to your account
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 dark:bg-red-200 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm flex justify-center gap-1">
          <p className="text-gray-600 dark:text-gray-400">Don't have an account?</p>
          <Link className="text-blue-600 hover:underline dark:text-blue-400 cursor-pointer" to="/signup">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;