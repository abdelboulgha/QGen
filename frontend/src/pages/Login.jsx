import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css'; // Fichier CSS partagé pour les pages d'authentification
// Import des images
import './AuthStyleFix.css'; 
import logoImg from '../utils/images/logo.png';
import googleImg from '../utils/images/google.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Effet pour animation d'entrée
  useEffect(() => {
    document.querySelector('.auth-form-container').classList.add('animate-in');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulons un délai pour l'authentification (à retirer en production)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = login(email, password, role);
      
      // Redirect based on role
      switch (user.role) {
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
    } catch (error) {
      setError('Erreur de connexion. Veuillez vérifier vos informations.');
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
              
              <div className="form-group">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="auth-select"
                >
                  <option value="student">Étudiant</option>
                  <option value="professor">Professeur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="auth-button"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>
            
            <div className="auth-alternative">
              <p>Continuer avec</p>
              <button className="social-login-button" onClick={handleGoogleLogin}>
                <img src={googleImg} alt="Google" /> Continuer avec Google
              </button>
            </div>
            
            <div className="auth-links">
              <Link to="/register" className="register-link">S'inscrire</Link>
              <span style={{ margin: '0 10px', color: '#ccc' }}>|</span>
              <Link to="/forgot-password" className="forgot-password-link">Mot de passe oublié?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;