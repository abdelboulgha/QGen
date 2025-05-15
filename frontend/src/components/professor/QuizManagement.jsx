// components/professor/QuizManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../common/Layout';
import './QuizManagement.css';
import axios from 'axios';

// Configuration d'axios pour pointer vers le backend
// Cela permet d'éviter de spécifier le port à chaque requête
axios.defaults.baseURL = 'http://localhost:8080';

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [error, setError] = useState(null);

  // Récupération des quiz au chargement de la page
  useEffect(() => {
    setLoading(true);

    // Récupération de l'ID du professeur depuis le localStorage
    const professeurId = localStorage.getItem('id');
    // Récupération du token d'authentification
    const token = localStorage.getItem('token');

    if (!professeurId) {
      setError("Impossible de récupérer l'ID du professeur. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    console.log("Récupération des quiz pour le professeur ID:", professeurId);

    // Requête vers le backend avec le bon URL
    axios.get(`/api/quizzes/professeur/summaries/${professeurId}`, {
      // Ajout du token d'authentification
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
        .then(response => {
          console.log("Données reçues:", response.data);

          // Transformer les données reçues en format utilisable
          const formattedQuizzes = response.data.map(quizData => {
            // Les indices correspondent à l'ordre des éléments dans Object[] de votre backend
            return {
              id: quizData[0],
              title: quizData[1],
              description: quizData[2] || 'Aucune description',
              questionsCount: quizData[3],
              createdAt: quizData[4],
              updatedAt: quizData[4], // On utilise la même date car pas de date de mise à jour dans l'API
              isPublic: quizData[5], // Récupération de l'état public/privé du quiz (boolean)
              status: quizData[5] ? 'active' : 'inactive', // Conversion du boolean en status textuel
              attempts: 0, // Ces données ne sont pas fournies par l'API pour l'instant
              avgScore: 0, // Ces données ne sont pas fournies par l'API pour l'instant
              duree: quizData[6] // Durée du quiz en minutes (maintenant à l'index 6)
            };
          });

          console.log("Quiz formatés:", formattedQuizzes);
          setQuizzes(formattedQuizzes);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erreur lors de la récupération des quiz:", err);
          setError(`Impossible de charger les quiz: ${err.message}. Veuillez réessayer plus tard.`);
          setLoading(false);
        });
  }, []); // Dépendance vide pour ne l'exécuter qu'une fois au chargement

  // Delete quiz
  const confirmDelete = () => {
    const token = localStorage.getItem('token');

    axios.delete(`/api/quizzes/${quizToDelete.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
        .then(() => {
          setQuizzes(quizzes.filter(quiz => quiz.id !== quizToDelete.id));
          closeDeleteModal();
        })
        .catch(err => {
          console.error("Erreur lors de la suppression du quiz:", err);
          alert(`Impossible de supprimer le quiz: ${err.message}`);
          closeDeleteModal();
        });
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Toggle quiz status (actif/inactif)
  const toggleQuizStatus = (id) => {
    // Récupérer le quiz concerné
    const quizToUpdate = quizzes.find(quiz => quiz.id === id);
    const token = localStorage.getItem('token');

    // Ici, vous devriez appeler votre API pour changer le statut dans la base de données
    // Par exemple:
    /*
    axios.put(`/api/quiz/${id}/toggle-status`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      // Mettre à jour l'interface utilisateur après confirmation du serveur
      setQuizzes(quizzes.map(quiz => {
        if (quiz.id === id) {
          return {
            ...quiz,
            isPublic: !quiz.isPublic,
            status: !quiz.isPublic ? 'active' : 'inactive'
          };
        }
        return quiz;
      }));
    })
    .catch(err => {
      console.error("Erreur lors de la mise à jour du statut:", err);
      alert(`Impossible de modifier le statut: ${err.message}`);
    });
    */

    // Pour l'instant, mettons simplement à jour l'interface
    setQuizzes(quizzes.map(quiz => {
      if (quiz.id === id) {
        const newIsPublic = !quiz.isPublic;
        return {
          ...quiz,
          isPublic: newIsPublic,
          status: newIsPublic ? 'active' : 'inactive'
        };
      }
      return quiz;
    }));
    setActiveDropdown(null);
  };

  // Open confirmation modal for delete
  const openDeleteModal = (quiz) => {
    setQuizToDelete(quiz);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  // Close confirmation modal
  const closeDeleteModal = () => {
    setQuizToDelete(null);
    setShowDeleteModal(false);
  };

  // Duplicate quiz
  const duplicateQuiz = (id) => {
    const quizToDuplicate = quizzes.find(quiz => quiz.id === id);

    // Version simplifiée - en production, appelez une API pour dupliquer le quiz
    const newQuiz = {
      ...quizToDuplicate,
      id: `temp_${Date.now()}`, // ID temporaire en attendant confirmation du serveur
      title: `${quizToDuplicate.title} - Copie`,
      isPublic: false, // Par défaut, le quiz dupliqué n'est pas public
      status: 'inactive', // On met le quiz en inactif par défaut
      attempts: 0,
      avgScore: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setQuizzes([newQuiz, ...quizzes]);
    setActiveDropdown(null);
  };

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = (id, e) => {
    if (e) {
      e.stopPropagation();
    }
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Filter, sort and search quizzes
  const filteredAndSortedQuizzes = quizzes
      .filter(quiz => {
        // Filter by status
        if (filter !== 'all' && quiz.status !== filter) {
          return false;
        }

        // Filter by search term
        if (searchTerm && !quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !quiz.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Handle special cases first
        if (sortBy === 'avgScore') {
          return sortOrder === 'asc'
              ? a.avgScore - b.avgScore
              : b.avgScore - a.avgScore;
        }
        if (sortBy === 'questionsCount') {
          return sortOrder === 'asc'
              ? a.questionsCount - b.questionsCount
              : b.questionsCount - a.questionsCount;
        }
        if (sortBy === 'attempts') {
          return sortOrder === 'asc'
              ? a.attempts - b.attempts
              : b.attempts - a.attempts;
        }

        // Default string comparison for other columns
        return sortOrder === 'asc'
            ? String(a[sortBy]).localeCompare(String(b[sortBy]))
            : String(b[sortBy]).localeCompare(String(a[sortBy]));
      });

  // Get status classes
  const getStatusClass = (status) => {
    switch(status) {
      case 'active':
        return 'status-badge active';
      case 'inactive':
        return 'status-badge inactive';
      case 'draft':
        return 'status-badge draft';
      default:
        return 'status-badge';
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch(status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'draft':
        return 'Brouillon';
      default:
        return status;
    }
  };

  return (
      <Layout title="Gestion des Quiz" userRole="professor">
        <div className="page-container">
          <div className="filters">
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
              <div className="loading">
                <div className="spinner"></div>
                <span>Chargement des quiz...</span>
              </div>
          ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                  Réessayer
                </button>
              </div>
          ) : filteredAndSortedQuizzes.length === 0 ? (
              <div className="no-results">
                <div className="empty-icon">🔍</div>
                <p>Aucun quiz ne correspond à vos critères.</p>
                <Link to="/professor/create-quiz" className="btn btn-primary mt-2">Créer un Quiz</Link>
              </div>
          ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                  <tr>
                    <th onClick={() => handleSort('title')} className="sortable-header">
                      Quiz {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('questionsCount')} className="sortable-header">
                      Questions {sortBy === 'questionsCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('createdAt')} className="sortable-header">
                      Date création {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('duree')} className="sortable-header">
                      Durée (min) {sortBy === 'duree' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {filteredAndSortedQuizzes.map(quiz => (
                      <tr key={quiz.id}>
                        <td>
                          <div className="quiz-title">
                            <div>{quiz.title}</div>
                            <small>{quiz.description}</small>
                          </div>
                        </td>
                        <td>{quiz.questionsCount}</td>
                        <td>{quiz.createdAt}</td>
                        <td>{quiz.duree} min</td>
                        <td>
                      <span className={getStatusClass(quiz.status)}>
                        {getStatusLabel(quiz.status)}
                      </span>
                        </td>
                        <td style={{ minWidth: '120px' }}>
                          <div className="action-buttons">
                            <Link to={`/professor/edit-quiz/${quiz.id}`} className="btn btn-icon" title="Éditer">
                              ✏️
                            </Link>

                            <Link to={`/professor/quiz-details/${quiz.id}`} className="btn btn-icon" title="Voir les détails">
                              📊
                            </Link>

                            <div className="dropdown-container">
                              <button
                                  className="btn btn-icon dropdown-toggle"
                                  onClick={(e) => toggleDropdown(quiz.id, e)}
                                  title="Plus d'options"
                              >
                                ⋮
                              </button>

                              {activeDropdown === quiz.id && (
                                  <div className="dropdown-menu">
                                    <button
                                        className="dropdown-item"
                                        onClick={() => duplicateQuiz(quiz.id)}
                                    >
                                      📋 Dupliquer
                                    </button>

                                    <button
                                        className="dropdown-item"
                                        onClick={() => toggleQuizStatus(quiz.id)}
                                    >
                                      🔄 {quiz.status === 'active' ? 'Désactiver' : 'Activer'}
                                    </button>

                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={() => openDeleteModal(quiz)}
                                    >
                                      🗑️ Supprimer
                                    </button>
                                  </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Confirmer la suppression</h3>
                  <button onClick={closeDeleteModal} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                  <div className="delete-icon">
                    ⚠️
                  </div>
                  <p className="delete-message">Êtes-vous sûr de vouloir supprimer le quiz "{quizToDelete.title}" ?</p>
                  <p className="delete-warning">Cette action est irréversible.</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-danger" onClick={confirmDelete}>Supprimer</button>
                  <button className="btn btn-secondary" onClick={closeDeleteModal}>Annuler</button>
                </div>
              </div>
            </div>
        )}
      </Layout>
  );
};

export default QuizManagement;