import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css'; // Fichier CSS partagé pour les pages d'authentification
// Import des images
import './AuthStyleFix.css'; 
import logoImg from '../utils/images/logo.png';
import googleImg from '../utils/images/google.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Effet pour animation d'entrée
  useEffect(() => {
    document.querySelector('.auth-form-container').classList.add('animate-in');
  }, []);

  // Évaluer la force du mot de passe
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Longueur minimum
    if (password.length >= 8) strength += 1;
    
    // Caractères spéciaux
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    // Chiffres
    if (/\d/.test(password)) strength += 1;
    
    // Lettres majuscules et minuscules
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validations
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    
    if (passwordStrength < 3) {
      setError('Votre mot de passe n\'est pas assez fort. Utilisez des lettres majuscules, minuscules, des chiffres et des caractères spéciaux.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulons un délai pour l'inscription (à retirer en production)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = register(name, email, password, role);
      
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
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Implémentation de l'inscription avec Google
    console.log('Inscription avec Google');
    // Mettre votre logique d'authentification Google ici
  };

  // Rendu de l'indicateur de force du mot de passe
  const renderPasswordStrength = () => {
    if (!password) return null;
    
    const strengthText = ['Faible', 'Moyen', 'Fort', 'Excellent'];
    const strengthColor = ['#ff4d4d', '#ffaa00', '#2196f3', '#4caf50'];
    
    return (
      <div className="password-strength" style={{ marginTop: '5px', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
          <span style={{ color: strengthColor[passwordStrength - 1] || '#ccc', marginRight: '8px' }}>
            {password ? (strengthText[passwordStrength - 1] || 'Trop faible') : ''}
          </span>
          <div style={{ display: 'flex', flex: 1 }}>
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                style={{
                  height: '4px',
                  flex: 1,
                  background: i < passwordStrength ? strengthColor[i] : '#eee',
                  marginRight: i < 3 ? '2px' : 0
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
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
            <h2 className="auth-form-title">INSCRIPTION</h2>
            
            {error && (
              <div className="error-message">
                <span role="img" aria-label="error" style={{ marginRight: '8px' }}>⚠️</span>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <div className="input-icon">
                  <i className="user-icon">👤</i>
                  <input
                    type="text"
                    placeholder="Nom complet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="auth-input"
                    autoComplete="name"
                  />
                </div>
              </div>
              
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
                    autoComplete="new-password"
                  />
                </div>
                {renderPasswordStrength()}
              </div>
              
              <div className="form-group">
                <div className="input-icon">
                  <i className="password-icon">🔒</i>
                  <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="auth-input"
                    autoComplete="new-password"
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
                {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
              </button>
            </form>
            
            <div className="auth-alternative">
              <p>Continuer avec</p>
              <button className="social-login-button" onClick={handleGoogleSignup}>
                <img src={googleImg} alt="Google" /> Continuer avec Google
              </button>
            </div>
            
            <div className="auth-links">
              <span>Déjà un compte?</span>
              <Link to="/login" className="login-link" style={{ marginLeft: '5px' }}>Se connecter</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;