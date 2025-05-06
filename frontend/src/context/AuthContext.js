import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for saved user on load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function - in real app, this would make an API call
  const login = (email, password, role) => {
    // Mock user object - in real implementation, this would come from backend
    const user = {
      id: `user-${Math.floor(Math.random() * 1000)}`,
      email,
      role, // "admin", "professor", or "student"
      name: email.split('@')[0]
    };

    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Register function - in real app, this would make an API call
  const register = (email, password, role) => {
    // Similar to login for now
    const user = {
      id: `user-${Math.floor(Math.random() * 1000)}`,
      email,
      role,
      name: email.split('@')[0]
    };

    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};