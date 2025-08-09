import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/AuthProvider";
import Header from "../components/Header";

// ProtectedRoute will redirect to login if not authenticated.
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  console.log("ProtectedRoute: isAuthenticated", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>
    <Header />
    <Outlet />
  </>;
};

export default ProtectedRoute;
