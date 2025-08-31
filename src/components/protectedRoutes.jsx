// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const location = useLocation();

  if (!user) {
    // If the user is not logged in, redirect them to the login page.
    // We also pass the current location in state so we can redirect back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is logged in, render the child components.
  return children;
};

export default ProtectedRoute;