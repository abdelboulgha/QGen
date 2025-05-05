// components/common/GlobalHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GlobalHeader = ({ title = 'Tableau de Bord' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <h1>{title}</h1>
      <button className="header-logout" onClick={handleLogout}>
        Déconnexion
      </button>
    </header>
  );
};

export default GlobalHeader;