import { Navigate } from "react-router-dom";
import { Spinner } from "./Spinner";
import { useAuth } from "../../features/auth/hooks/useAuth";

export function RoleRedirect() {
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser) return <Spinner />;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "HOST") {
    return <Navigate to="/host/dashboard" replace />;
  }

  return <Navigate to="/guest/dashboard" replace />;
}