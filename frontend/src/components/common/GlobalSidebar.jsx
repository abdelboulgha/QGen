// components/common/GlobalSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Book, Users, Plus, Edit3, BarChart2, CheckSquare, Award, Calendar } from 'lucide-react';

const GlobalSidebar = ({ userRole = 'professor' }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Define navigation links based on user role
  const getNavLinks = (role) => {
    switch(role) {
      case 'admin':
        return [
          { to: '/admin/', text: 'Tableau de Bord', icon: <Book size={18} /> },
          { to: '/admin/users', text: 'Gestion des Étudiants', icon: <Users size={18} /> },
          { to: '/admin/professors', text: 'Gestion des Professeurs', icon: <Users size={18} /> },
          
        ];
      case 'professor':
        return [
          { to: '/professor/', text: 'Tableau de Bord', icon: <Book size={18} /> },
          { to: '/professor/create-quiz', text: 'Créer un Quiz', icon: <Plus size={18} /> },
          { to: '/professor/manage-quiz', text: 'Gérer les Quiz', icon: <Edit3 size={18} /> },
          { to: '/professor/results', text: 'Résultats', icon: <BarChart2 size={18} /> },
          { to: '/professor/students', text: 'Étudiants', icon: <Users size={18} /> },
        ];
      case 'student':
        return [
          { to: '/student/', text: 'Tableau de Bord', icon: <Book size={18} /> },
          { to: '/student/quizzes', text: 'Mes Quiz', icon: <CheckSquare size={18} /> },
          { to: '/student/results', text: 'Mes Résultats', icon: <Award size={18} /> },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks(userRole);
  
  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">QGen</div>
        {userRole === 'professor' && (
          <Link to="/professor/create-quiz" className="btn btn-primary" style={{ padding: '6px', borderRadius: '50%' }}>
            <Plus size={16} />
          </Link>
        )}
      </div>
      
      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <Link 
            key={link.to} 
            to={link.to} 
            className={`sidebar-nav-item ${isActive(link.to) ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.text}</span>
          </Link>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-avatar">
          {currentUser?.name?.charAt(0).toUpperCase() || userRole.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: '500' }}>{currentUser?.name || 'Utilisateur'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Connecté</div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSidebar;