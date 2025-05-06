import React, { useState, useEffect } from 'react';
import { Users, Book, CheckSquare, Award } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import Layout from '../common/Layout';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    activeQuizzes: 0,
    completedSessions: 0,
  });

  const [loading, setLoading] = useState(true);

  const userScores = {
    'Utilisateur 1': [12, 15, 18, 20],
    'Utilisateur 2': [10, 14, 16, 19],
    'Utilisateur 3': [8, 12, 15, 17],
  };

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: 150,
        totalQuizzes: 45,
        activeQuizzes: 20,
        completedSessions: 500,
      });
      setLoading(false);
    }, 800);
  }, []);

  // Données pour le graphique 1 : Nombre de quiz par professeur
  const quizData = {
    labels: ['Professeur A', 'Professeur B', 'Professeur C', 'Professeur D'],
    datasets: [
      {
        label: 'Nombre de Quiz',
        data: [10, 15, 8, 12],
        backgroundColor: ['#4285f4', '#ea4335', '#fbbc05', '#34a853'],
      },
    ],
  };

  // Données pour le graphique 2 : Développement des notes de tous les utilisateurs
  const scoreData = {
    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'],
    datasets: Object.keys(userScores).map((user, index) => ({
      label: user,
      data: userScores[user],
      borderColor: ['#4285f4', '#ea4335', '#fbbc05', '#34a853'][index],
      backgroundColor: ['rgba(66, 133, 244, 0.2)', 'rgba(234, 67, 53, 0.2)', 'rgba(251, 188, 5, 0.2)', 'rgba(52, 168, 83, 0.2)'][index],
      tension: 0.4,
    })),
  };

  return (
    <Layout title="Tableau de Bord Admin" userRole="admin">
      <h2>Bienvenue, Administrateur!</h2>

      {loading ? (
        <div className="loading">Chargement des données...</div>
      ) : (
        <>
         <div className="dashboard-cards">
  {[
    { title: 'Utilisateurs', icon: <Users size={20} color="#2ac3a2" />, value: stats.totalUsers },
    { title: 'Total Quiz', icon: <Book size={20} color="#4285f4" />, value: stats.totalQuizzes },
    { title: 'Quiz Actifs', icon: <CheckSquare size={20} color="#ea4335" />, value: stats.activeQuizzes },
    { title: 'Sessions Complétées', icon: <Award size={20} color="#fbbc05" />, value: stats.completedSessions },
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

          {/* Graphiques en bas */}
          <div className="charts-container">
  <div className="chart">
    <h3>Nombre de Quiz par Professeur</h3>
    <Bar data={quizData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
  </div>
  <div className="chart">
    <h3>Développement des Notes de Tous les Utilisateurs</h3>
    <Line data={scoreData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
  </div>
</div>
        </>
      )}
    </Layout>
  );
};

export default AdminDashboard;