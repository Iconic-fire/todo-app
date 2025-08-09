import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/AuthProvider";
import Header from "../components/Header";

// ProtectedRoute will redirect to login if not authenticated.
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>
    <Header />
    <Outlet />
  </>;
};

export default ProtectedRoute;
