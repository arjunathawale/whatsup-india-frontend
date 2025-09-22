import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken")); // Example auth check
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};