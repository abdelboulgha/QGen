import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Book, 
  Users, 
  CheckSquare, 
  Award, 
  Plus, 
  Calendar 
} from 'lucide-react';
import Layout from '../common/Layout';

const ProfessorDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalStudents: 0,
    completedSessions: 0
  });
  
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalQuizzes: 12,
        activeQuizzes: 5,
        totalStudents: 78,
        completedSessions: 243
      });
      
      setRecentQuizzes([
        {
          id: 'q1',
          title: 'Introduction à JavaScript',
          createdAt: '2025-04-25',
          status: 'active',
          attempts: 23,
          avgScore: 78
        },
        {
          id: 'q2',
          title: 'Les bases de React',
          createdAt: '2025-04-20',
          status: 'active',
          attempts: 18,
          avgScore: 65
        },
        {
          id: 'q3',
          title: 'CSS Avancé',
          createdAt: '2025-04-15',
          status: 'inactive',
          attempts: 25,
          avgScore: 72
        }
      ]);
      
      setLoading(false);
    }, 800);
  }, []);
  
  return (
    <Layout title="Tableau de Bord" userRole="professor">
      {loading ? (
        <div className="loading">Chargement des données...</div>
      ) : (
        <>
          <div className="dashboard-cards">
            {[
              { title: 'Total Quiz', icon: <Book size={20} color="#2ac3a2" />, value: stats.totalQuizzes },
              { title: 'Quiz Actifs', icon: <CheckSquare size={20} color="#4285f4" />, value: stats.activeQuizzes },
              { title: 'Étudiants', icon: <Users size={20} color="#ea4335" />, value: stats.totalStudents },
              { title: 'Sessions Complétées', icon: <Award size={20} color="#fbbc05" />, value: stats.completedSessions }
            ].map((card, idx) => (
              <div className="card" key={idx}>
                <div className="card-header">
                  <h3>{card.title}</h3>
                  {card.icon}
                </div>
                <div className="card-content">
                  <p className="stat-number">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          <section className="recent-activity">
            <div className="section-header">
              <h2>Quiz Récents</h2>
              <Link to="/professor/create-quiz" className="btn btn-primary">
                <Plus size={16} />
                Créer un Quiz
              </Link>
            </div>
            
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Tentatives</th>
                    <th>Score Moyen</th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuizzes.map(quiz => (
                    <tr key={quiz.id}>
                      <td>{quiz.title}</td>
                      <td>
                        <Calendar size={14} style={{ marginRight: '5px', color: '#666' }} />
                        {quiz.createdAt}
                      </td>
                      <td>
                        <span className={`status-badge ${quiz.status}`}>
                          {quiz.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>{quiz.attempts}</td>
                      <td>
                        <div className="d-flex align-center">
                          <span style={{
                            display: 'inline-block',
                            width: `${quiz.avgScore}%`,
                            height: '6px',
                            backgroundColor: quiz.avgScore > 70 ? '#34a853' : quiz.avgScore > 50 ? '#fbbc05' : '#ea4335',
                            borderRadius: '3px',
                            marginRight: '8px'
                          }}></span>
                          {quiz.avgScore}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
};

export default ProfessorDashboard;