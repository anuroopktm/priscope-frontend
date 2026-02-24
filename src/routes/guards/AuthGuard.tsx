import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AuthGuard() {
  const accessToken = localStorage.getItem("access_token");
  const { pathname } = useLocation();

  if (!accessToken) {
    return <Navigate to="/auth/sign-in" state={{ from: pathname }} replace />;
  }

  return <Outlet />;
}
