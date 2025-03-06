import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import AdminDashboard from "./Admin/AdminDashboard";

const ProtectedRoute: React.FC<{ children: JSX.Element; role: string }> = ({
  children,
  role,
}) => {
  const { user } = useAuth();
  console.log("ProtectedRoute user:", user);

  if (!user) {
    console.log("Redirecting to /login because user is null");
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    console.log("Redirecting to / because role mismatch");
    return <Navigate to="/" />;
  }

  // Render children if all checks pass
  return children;
};

export default ProtectedRoute;

