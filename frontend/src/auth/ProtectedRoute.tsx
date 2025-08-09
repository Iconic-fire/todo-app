import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthProvider";
import { Header } from "../components";

// ProtectedRoute will redirect to login if not authenticated.
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>
    <Header />
    <Outlet />
  </>;
};
