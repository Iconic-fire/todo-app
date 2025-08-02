import { useNavigate } from "react-router";
import { useState } from "react";
import { getRefreshToken, removeTokens } from "../auth/utils";
import { accountsApiAuthenticated } from "../api/main";

function Header() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const refresh = getRefreshToken();
      if (refresh) {
        await accountsApiAuthenticated.accountsLogoutCreate({ refresh });
      }
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
      <h1 className="text-xl font-semibold">My App</h1>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition"
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </header>
  );
}

export default Header;
