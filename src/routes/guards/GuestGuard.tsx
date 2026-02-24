import { Navigate, Outlet } from "react-router-dom";

export default function GuestGuard() {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    return <Navigate to="/scenario-builder" replace />;
  }

  return <Outlet />;
}
