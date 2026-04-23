import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');
  const normalizedRole = role ? role.toLowerCase() : '';

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(normalizedRole)) {
    // Redirect to home if user doesn't have the required role
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
