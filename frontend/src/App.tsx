import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ChangePasswordPage from "./pages/ChangePassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./auth/ProtectedRoute";
import { setNavigate } from "./auth/redirects";
import ResetPasswordConfirm from "./pages/PasswordResetConfirm";
import { getRefreshToken, isTokenExpired } from "./auth/utils";
import { startTokenRefreshScheduler, stopTokenRefreshScheduler } from "./auth/tokenSchedular";


const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/verify-email",
  "/reset-password",
  "/reset-password-confirm",
];

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  useEffect(() => {
    const currentPath = location.pathname;
    const isPublic = PUBLIC_ROUTES.includes(currentPath);
    const refreshToken = getRefreshToken();

    if (!isPublic && refreshToken && !isTokenExpired(refreshToken)) {
      // User is on a protected route and has a valid token
      startTokenRefreshScheduler();
    } else {
      // Either user is on a public route or token is missing/expired
      stopTokenRefreshScheduler();
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
