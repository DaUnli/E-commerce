import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          credentials: "include", // send cookie
        });
        if (res.ok) setIsAuth(true);
        else setIsAuth(false);
      } catch {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) return <p className="text-white">Loading...</p>;
  return isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
