import { Routes, Route } from "react-router";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ChangePasswordPage from "./pages/ChangePassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./auth/ProtectedRoute";
// import { setNavigate } from "./auth/redirects";
import ResetPasswordConfirm from "./pages/PasswordResetConfirm";
import { useEffect } from "react";
import { accountsApi } from "./api/main";
// import { setAccessToken } from "./auth/utils";
// import { startTokenRefreshScheduler, stopTokenRefreshScheduler } from "./auth/tokenScheduler";
// import { API_BASE_URL } from "./api/axios";
// import axios from "axios";


// const PUBLIC_ROUTES = [
//   "/login",
//   "/signup",
//   "/verify-email",
//   "/reset-password",
//   "/reset-password-confirm",
// ];

function App() {

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
