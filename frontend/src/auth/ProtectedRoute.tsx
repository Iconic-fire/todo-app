import { Navigate } from "react-router";
import { getRefreshToken, isTokenExpired } from "./utils";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = getRefreshToken();

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
