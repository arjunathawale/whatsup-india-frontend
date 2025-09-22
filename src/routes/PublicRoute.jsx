// src/routes/PublicRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PublicRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Redirect to="/dashboard" /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;
