import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      
      // Configuration d'Axios pour inclure le token dans les requêtes
      if (user.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      }
    }
    
    setLoading(false);
  }, []);

  // Login function - connects to the API
  const login = (token, role) => {
    console.log("Logging in with token:", token, "and role:", role);
    
    // Créer l'objet utilisateur avec les informations disponibles
    const user = {
      token: token,
      role: role.toLowerCase(), // Conversion en minuscules
      isAuthenticated: true
    };

    // Stocker les informations
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Configuration d'Axios pour les futures requêtes
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    console.log("User set in context:", user);
    return user;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setCurrentUser(null);
    localStorage.removeItem('user');
    
    // Supprimer l'en-tête d'autorisation
    delete axios.defaults.headers.common['Authorization'];
  };

  // Register function - in real app, this would connect to the API
  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Fonction pour vérifier si le token est encore valide
  const checkTokenValidity = async () => {
    const user = currentUser;
    if (!user || !user.token) return false;
    
    try {
      // Endpoint à adapter selon votre API (ou supprimer cette vérification si pas disponible)
      // await axios.get('http://localhost:8080/api/auth/validate-token');
      return true; // Assumer que le token est valide si pas d'API de validation
    } catch (error) {
      console.error("Token validation error:", error);
      // Token invalide ou expiré seulement si une erreur 401/403
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logout();
        return false;
      }
      return true; // Garder l'utilisateur connecté en cas d'autres erreurs
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    checkTokenValidity
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};