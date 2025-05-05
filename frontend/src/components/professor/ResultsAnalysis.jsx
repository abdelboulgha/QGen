import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ResultsAnalysis = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch quizzes
  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      const mockQuizzes = [
        {
          id: 'q1',
          title: 'Introduction à JavaScript',
          description: 'Les bases du langage JavaScript pour les débutants',
          createdAt: '2025-04-25',
          updatedAt: '2025-04-26',
          status: 'active',
          questionsCount: 15,
          attempts: 23,
          avgScore: 78,
        },
        {
          id: 'q2',
          title: 'Les bases de React',
          description: 'Comprendre les concepts fondamentaux de React',
          createdAt: '2025-04-20',
          updatedAt: '2025-04-22',
          status: 'active',
          questionsCount: 12,
          attempts: 18,
          avgScore: 65,
        },
        {
          id: 'q3',
          title: 'CSS Avancé',
          description: 'Techniques avancées de CSS pour le design web moderne',
          createdAt: '2025-04-15',
          updatedAt: '2025-04-15',
          status: 'active',
          questionsCount: 20,
          attempts: 25,
          avgScore: 72,
        },
        {
          id: 'q4',
          title: 'Introduction à Python',
          description: 'Les bases du langage Python pour les débutants',
          createdAt: '2025-04-10',
          updatedAt: '2025-04-12',
          status: 'active',
          questionsCount: 18,
          attempts: 35,
          avgScore: 81,
        },
      ];

      // Filter only active quizzes
      const activeQuizzes = mockQuizzes.filter((quiz) => quiz.status === 'active');

      setQuizzes(activeQuizzes);
      setLoading(false);
    }, 800);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter quizzes by search term
  const filteredQuizzes = quizzes.filter((quiz) => {
    if (searchTerm && !quiz.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="content-area">
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Analyse des Résultats</h1>
      </div>

      <div className="filters mt-4">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un quiz actif..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Chargement des quiz actifs...</div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="no-results">
          <p>Aucun quiz actif ne correspond à vos critères.</p>
        </div>
      ) : (
        <div className="quiz-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{quiz.title}</h2>
              <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>{quiz.description}</p>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Créé le: {quiz.createdAt}</p>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Dernière modif.: {quiz.updatedAt}</p>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Questions: {quiz.questionsCount}</p>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Tentatives: {quiz.attempts}</p>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>Score moyen: {quiz.avgScore > 0 ? `${quiz.avgScore}%` : '-'}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link to={`/professor/quiz-details/${quiz.id}`} className="btn btn-secondary" style={{ textDecoration: 'none', color: '#007bff' }}>
                  Détails
                </Link>
                <Link to={`/professor/student-performance/${quiz.id}`} className="btn btn-primary" style={{ textDecoration: 'none', color: '#007bff' }}>
                  Performance
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsAnalysis;