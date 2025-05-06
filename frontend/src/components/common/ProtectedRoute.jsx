import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Protected route component to check if user is authenticated and has correct role
const ProtectedRoute = ({ children, role }) => {
  const { currentUser, checkTokenValidity } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  // Effet pour vérifier la validité du token à chaque montage du composant
  useEffect(() => {
    const validateToken = async () => {
      setIsChecking(true);
      console.log("ProtectedRoute: checking user authentication");
      console.log("Current user:", currentUser);
      
      if (currentUser) {
        const valid = await checkTokenValidity();
        console.log("Token validity check result:", valid);
        setIsValid(valid);
      } else {
        console.log("No current user found");
        setIsValid(false);
      }
      
      setIsChecking(false);
    };
    
    validateToken();
  }, [checkTokenValidity, currentUser]);

  // Afficher un loader pendant la vérification
  if (isChecking) {
    console.log("Still checking token validity...");
    return <div>Vérification de l'authentification...</div>;
  }

  console.log("ProtectedRoute decision - currentUser:", currentUser, "isValid:", isValid);

  if (!currentUser || !isValid) {
    // User is not logged in or token is invalid
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  if (role && currentUser.role !== role) {
    // User doesn't have the required role
    console.log(`User role ${currentUser.role} doesn't match required role ${role}, redirecting`);
    
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
  console.log("User is authenticated with correct role, rendering protected content");
  return children;
};

export default ProtectedRoute;