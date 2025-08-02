import { Navigate, Outlet } from "react-router";
import { getRefreshToken, isTokenExpired } from "./utils";
import Header from "../components/Header";

function ProtectedRoute( ) {
  const token = getRefreshToken();

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  return <>
    <Header />
    <Outlet />
  </>;
};

export default ProtectedRoute;
