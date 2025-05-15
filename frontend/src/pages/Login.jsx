import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Auth.css'; // Fichier CSS partagé pour les pages d'authentification
// Import des images
import './AuthStyleFix.css';
import logoImg from '../utils/images/logo.png';
import googleImg from '../utils/images/google.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // Effet pour animation d'entrée
  useEffect(() => {
    const container = document.querySelector('.auth-form-container');
    if (container) {
      container.classList.add('animate-in');
    }
  }, []);

  // Redirection si déjà connecté
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et rediriger si nécessaire
    if (currentUser) {
      console.log("User already logged in, redirecting to dashboard");
      redirectToDashboard(currentUser.role);
    }
  }, [currentUser, navigate]);

  // Fonction de redirection selon le rôle
  const redirectToDashboard = (role) => {
    console.log("Redirecting to dashboard for role:", role);
    switch (role.toLowerCase()) {
      case 'admin':
        navigate('/admin');
        break;
      case 'professor':
        navigate('/professor');
        break;
      case 'student':
        navigate('/student');
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log("Submitting login form with email:", email);
      // Appel à l'API backend pour l'authentification via Axios
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });

      // Avec Axios, les données sont directement dans response.data
      const userData = response.data;
      console.log("Login successful, userData:", userData);
      // ✅ Stockage du token dans localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('role', userData.role);
      localStorage.setItem('id', userData.id);

      // Stockage du token dans le contexte d'authentification
      const user = login(userData.token, userData.role);
      console.log("User object after login:", user);

      // Vérification si l'utilisateur doit changer son mot de passe
      if (userData.mustChangePassword) {
        console.log("User must change password, redirecting");
        navigate('/change-password');
        return;
      }

      // Redirection en fonction du rôle (conversion en minuscules pour la cohérence)
      redirectToDashboard(userData.role.toLowerCase());


    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        setError(`email ou mot de passe incorrect`);
      } else if (error.request) {
        // La requête a été faite mais pas de réponse reçue
        setError('Erreur de connexion: Le serveur ne répond pas.');
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        setError('Erreur de connexion. Veuillez vérifier vos informations.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implémentation de la connexion Google
    console.log('Connexion avec Google');
    // Mettre votre logique d'authentification Google ici
  };

  return (
      <div className="auth-page">
        <div className="auth-layout">
          {/* Left panel */}
          <div className="auth-sidebar">
            <div className="auth-logo">
              <img src={logoImg} alt="QGen Logo" className="logo-img" />
              <h1>QGen</h1>
            </div>
            <div className="auth-slogan">
              <h2>Un sujet, un quiz.<br/>C'est tout!</h2>
              <p className="auth-subtitle">Votre assistant pour créer des quiz simples, rapides et efficaces.</p>
            </div>
          </div>

          {/* Right panel */}
          <div className="auth-content">
            <div className="auth-welcome">
              <h1>BIENVENUE</h1>
            </div>
            <div className="auth-form-container">
              <h2 className="auth-form-title">CONNEXION</h2>

              {error && (
                  <div className="error-message">
                    <span role="img" aria-label="error" style={{ marginRight: '8px' }}>⚠️</span>
                    {error}
                  </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <div className="input-icon">
                    <i className="email-icon">✉️</i>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                        autoComplete="email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-icon">
                    <i className="password-icon">🔒</i>
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                        autoComplete="current-password"
                    />
                  </div>
                </div>

                <button
                    type="submit"
                    className="auth-button"
                    disabled={isLoading}
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </form>


              <div className="auth-links">
                <Link to="/forgot-password" className="forgot-password-link">Mot de passe oublié?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;