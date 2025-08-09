import { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { removeTokens } from "../auth/utils";
import { useAuth } from "../auth/AuthProvider";

function Header() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const { logout } = useAuth();

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      // await accountsApiAuthenticated.accountsLogoutCreate({});
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      removeTokens();
      navigate("/login");
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="flex items-center justify-between bg-gray-800 text-white px-6 py-4 shadow-md">
      <h1 className="text-xl font-semibold">TODO App</h1>
      <nav className="flex space-x-4 items-center">
        <NavLink to="/" className={({ isActive }) => (isActive ? "text-white" : "text-gray-400 hover:underline hover:text-white")}>
          Home
        </NavLink>
        <NavLink to="/change-password" className={({ isActive }) => (isActive ? "text-white" : "text-gray-400 hover:underline hover:text-white")}>
          Change Password
        </NavLink>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </nav>
    </header>
  );
}

export default Header;
