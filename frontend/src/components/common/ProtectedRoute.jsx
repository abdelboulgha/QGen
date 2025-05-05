import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Protected route component to check if user is authenticated and has correct role
const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // User is not logged in
    return <Navigate to="/login" />;
  }

  if (role && currentUser.role !== role) {
    // User doesn't have the required role
    // Redirect to their appropriate dashboard
    switch (currentUser.role) {
      case 'admin':
        return <Navigate to="/admin" />;
      case 'professor':
        return <Navigate to="/professor" />;
      case 'student':
        return <Navigate to="/student" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  // User is authenticated and has the right role
  return children;
};

export default ProtectedRoute;