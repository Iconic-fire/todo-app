import { Outlet } from "react-router";
import Header from "../components/Header";

function ProtectedRoute() {
  // TODO: if not already logged in navigate to login page

  return <>
    <Header />
    <Outlet />
  </>;
};

export default ProtectedRoute;
