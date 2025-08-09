import { Routes, Route } from "react-router";
import "./App.css";
import { ProtectedRoute } from "./auth";
import {
  ChangePassword,
  Home,
  Login,
  NotFound,
  ResetPassword,
  ResetPasswordConfirm,
  Signup,
  VerifyEmail,
} from "./pages";

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
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
