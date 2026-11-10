import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "../../components/ui/PageLoader";
import { useAuth } from "./useAuth";
import { getUserRoles } from "./useHasRole";

export default function ProtectedRoute({ roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader label="Restoring your session…" />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles.length === 0) return <Outlet />;

  const userRoles = getUserRoles(user);
  if (!roles.some((role) => userRoles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
