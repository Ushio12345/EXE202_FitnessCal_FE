import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/loading/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("accessToken");

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    // You can implement role checking logic here
    // For now, we'll assume admin routes need admin role
    // Note: Role checking should be implemented based on your JWT token or backend response
    if (requiredRole === "admin") {
      // This is a placeholder - implement actual role checking
      // You might want to decode JWT token to get role
      return <Navigate to="/user" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
