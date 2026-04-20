import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}
