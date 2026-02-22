import { Navigate } from "react-router-dom";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: Props) => {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;