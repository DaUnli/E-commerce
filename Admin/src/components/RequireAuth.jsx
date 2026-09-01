import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { canAccess } from "../config/roles";

const RequireAuth = ({ module }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (module && !canAccess(user.role, module)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
