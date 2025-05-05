// components/professor/QuizManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

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
          avgScore: 78
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
          avgScore: 65
        },
        {
          id: 'q3',
          title: 'CSS Avancé',
          description: 'Techniques avancées de CSS pour le design web moderne',
          createdAt: '2025-04-15',
          updatedAt: '2025-04-15',
          status: 'inactive',
          questionsCount: 20,
          attempts: 25,
          avgScore: 72
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
          avgScore: 81
        },
        {
          id: 'q5',
          title: 'Bases de données SQL',
          description: 'Introduction aux bases de données relationnelles',
          createdAt: '2025-04-05',
          updatedAt: '2025-04-07',
          status: 'draft',
          questionsCount: 22,
          attempts: 0,
          avgScore: 0
        }
      ];
      
      setQuizzes(mockQuizzes);
      setLoading(false);
    }, 800);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Toggle quiz status
  const toggleQuizStatus = (id) => {
    setQuizzes(quizzes.map(quiz => {
      if (quiz.id === id) {
        const newStatus = quiz.status === 'active' ? 'inactive' : 'active';
        return { ...quiz, status: newStatus };
      }
      return quiz;
    }));
  };

  // Open confirmation modal for delete
  const openDeleteModal = (quiz) => {
    setQuizToDelete(quiz);
    setShowDeleteModal(true);
  };

  // Close confirmation modal
  const closeDeleteModal = () => {
    setQuizToDelete(null);
    setShowDeleteModal(false);
  };

  // Delete quiz
  const confirmDelete = () => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== quizToDelete.id));
    closeDeleteModal();
  };

  // Duplicate quiz
  const duplicateQuiz = (id) => {
    const quizToDuplicate = quizzes.find(quiz => quiz.id === id);
    const newQuiz = {
      ...quizToDuplicate,
      id: `q${Date.now()}`,
      title: `${quizToDuplicate.title} - Copie`,
      status: 'draft',
      attempts: 0,
      avgScore: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setQuizzes([newQuiz, ...quizzes]);
  };

  // Filter and search quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    // Filter by status
    if (filter !== 'all' && quiz.status !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !quiz.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="content-area">
      <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Gestion des Quiz</h1>
        <Link to="/professor/create-quiz" className="btn btn-primary">Créer un Quiz</Link>
      </div>
      
      <div className="filters mt-4">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un quiz..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="filter-options">
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">Tous les Quiz</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
            <option value="draft">Brouillons</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Chargement des quiz...</div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="no-results">
          <p>Aucun quiz ne correspond à vos critères.</p>
          <Link to="/professor/create-quiz" className="btn btn-primary mt-2">Créer un Quiz</Link>
        </div>
      ) : (
        <div className="table-container mt-4">
          <table className="table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Questions</th>
                <th>Date de création</th>
                <th>Dernière modif.</th>
                <th>Statut</th>
                <th>Tentatives</th>
                <th>Score moyen</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.map(quiz => (
                <tr key={quiz.id}>
                  <td>
                    <div className="quiz-title">
                      <div>{quiz.title}</div>
                      <small>{quiz.description}</small>
                    </div>
                  </td>
                  <td>{quiz.questionsCount}</td>
                  <td>{quiz.createdAt}</td>
                  <td>{quiz.updatedAt}</td>
                  <td>
                    <span className={`status-badge ${quiz.status}`}>
                      {quiz.status === 'active' ? 'Actif' : 
                       quiz.status === 'inactive' ? 'Inactif' : 'Brouillon'}
                    </span>
                  </td>
                  <td>{quiz.attempts}</td>
                  <td>{quiz.avgScore > 0 ? `${quiz.avgScore}%` : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/professor/edit-quiz/${quiz.id}`} className="btn btn-secondary">Éditer</Link>
                      
                      <button 
                        className={`btn ${quiz.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggleQuizStatus(quiz.id)}
                      >
                        {quiz.status === 'active' ? 'Désactiver' : 'Activer'}
                      </button>
                      
                      
                      <Link to={`/professor/quiz-details/${quiz.id}`} className="btn btn-secondary">
                            Résultats
                      </Link>
                      
                      <button 
                        className="btn btn-danger"
                        onClick={() => openDeleteModal(quiz)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button onClick={closeDeleteModal} className="close-button">&times;</button>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer le quiz "{quizToDelete.title}" ?</p>
              <p>Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button onClick={closeDeleteModal} className="btn btn-secondary">Annuler</button>
              <button onClick={confirmDelete} className="btn btn-danger">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;