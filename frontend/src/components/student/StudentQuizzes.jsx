import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Clock, Award, CheckSquare, BookOpen, RotateCw, User, HelpCircle } from 'lucide-react';
import Layout from '../common/Layout';
import axios from 'axios';

const publicAxios = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 20000,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
});

const StudentQuizzes = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [state, setState] = useState({
    loading: true,
    quizzes: [],
    error: null
  });
  const [activeTab, setActiveTab] = useState('available');

  const fetchQuizzes = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const timestamp = Date.now();
      const response = await publicAxios.get(`/api/quizzes?timestamp=${timestamp}`);

      console.log("API Response:", response.data);

      if (!response.data) {
        throw new Error('Empty server response');
      }

      setState({
        loading: false,
        quizzes: Array.isArray(response.data) ? response.data : [],
        error: null
      });

    } catch (error) {
      console.error("Error details:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: error.response?.data?.message ||
              "Service temporarily unavailable",
          status: error.response?.status,
          isNetworkError: !error.response
        }
      }));
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchQuizzes();
    return () => controller.abort();
  }, [fetchQuizzes]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatDuration = (minutes) => {
    return `${minutes} min`;
  };

  const getRemainingTime = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = Math.abs(due - now);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} jour${diffDays > 1 ? 's' : ''} et ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
  };

  const getDueDateUrgency = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays === 0) return 'urgent';
    if (diffDays <= 2) return 'soon';
    return 'normal';
  };

  const getFilteredQuizzes = () => {
    return state.quizzes;
  };

  if (state.loading) {
    return (
        <Layout title="Mes Quiz" userRole="student">
          <div className="flex flex-col items-center justify-center h-64">
            <RotateCw className="animate-spin h-12 w-12 text-blue-500" />
            <p className="mt-4 text-lg">Chargement des quiz...</p>
            <small className="text-gray-500">Veuillez patienter</small>
          </div>
        </Layout>
    );
  }

  if (state.error) {
    return (
        <Layout title="Mes Quiz" userRole="student">
          <div className="max-w-md mx-auto p-6 bg-red-50">
            <h3 className="text-xl font-bold text-red-600 mb-2">Erreur de chargement</h3>
            <p className="text-red-700 mb-4">{state.error.message}</p>

            <div className="flex space-x-3">
              <button
                  onClick={fetchQuizzes}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
              >
                <RotateCw size={16} className="mr-2" /> Réessayer
              </button>

              {state.error.isNetworkError && (
                  <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-300"
                  >
                    Se reconnecter
                  </button>
              )}
            </div>
          </div>
        </Layout>
    );
  }

  return (
      <Layout title="Mes Quiz" userRole="student">
        <div className="tabs bg-white shadow-md rounded-lg mb-8 p-4">
          <div className="flex flex-col md:flex-row gap-5">
            <button
                className={`tab flex flex-1 items-center justify-center px-8 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                    activeTab === 'available'
                        ? 'bg-teal-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('available')}
            >
              <BookOpen size={22} className="mr-3"/>
              <span>Quiz disponibles</span>
              <span className="ml-3 bg-white text-teal-700 text-sm font-medium px-3 py-1 rounded-full">
            {getFilteredQuizzes().length}
          </span>
            </button>

            <button
                className={`tab flex flex-1 items-center justify-center px-8 py-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                    activeTab === 'completed'
                        ? 'bg-teal-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('completed')}
            >
              <CheckSquare size={22} className="mr-3"/>
              <span>Quiz complétés</span>
              <span className="ml-3 bg-white text-teal-700 text-sm font-medium px-3 py-1 rounded-full">
            0
          </span>
            </button>
          </div>
        </div>

        <div className="tab-content">
          <div className="quizzes-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredQuizzes().length === 0 ? (
                <div className="no-quizzes col-span-full py-16">
                  <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                      <BookOpen size={32} className="text-gray-400"/>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun quiz disponible</h3>
                    <p className="text-gray-500 text-center max-w-md">Vérifiez plus tard ou contactez votre professeur
                      pour plus d'informations sur les quiz à venir.</p>
                  </div>
                </div>
            ) : (
                getFilteredQuizzes().map(quiz => (
                    <div key={quiz.id}
                         className="quiz-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div
                          className="quiz-card-header p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <span className="course-code bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                      {quiz.cours?.code || 'N/A'}
                    </span>
                        <span className={`due-date flex items-center text-sm ${
                            getDueDateUrgency(quiz.datePublication) === 'urgent' ? 'text-red-600' :
                                getDueDateUrgency(quiz.datePublication) === 'soon' ? 'text-orange-600' :
                                    getDueDateUrgency(quiz.datePublication) === 'expired' ? 'text-gray-500' : 'text-green-600'
                        }`}>
                      <Clock size={14} className="mr-1"/>
                      Date limite: {formatDate(quiz.datePublication)}
                    </span>
                      </div>

                      <div className="quiz-card-content p-5">
                        <h2 className="quiz-title text-xl font-bold text-gray-800 mb-2">{quiz.titre}</h2>
                        <p className="quiz-description text-gray-600 mb-4">{quiz.description || 'Aucune description disponible'}</p>

                        <div className="quiz-details space-y-3 mb-4">
                          <div className="quiz-detail flex items-center text-sm text-gray-500">
                            <User size={15} className="mr-2 text-gray-400"/>
                            <span className="detail-label font-medium mr-1">Professeur:</span>
                            <span
                                className="detail-value">{quiz.createur ? `${quiz.createur.prenom} ${quiz.createur.nom}` : 'N/A'}</span>
                          </div>
                          <div className="quiz-detail flex items-center text-sm text-gray-500">
                            <Clock size={15} className="mr-2 text-gray-400"/>
                            <span className="detail-label font-medium mr-1">Durée:</span>
                            <span className="detail-value">{formatDuration(quiz.duree)}</span>
                          </div>
                          <div className="quiz-detail flex items-center text-sm text-gray-500">
                            <HelpCircle size={15} className="mr-2 text-gray-400"/>
                            <span className="detail-label font-medium mr-1">Questions:</span>
                            <span className="detail-value">{quiz.questions?.length || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div
                          className="quiz-card-footer p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <span className="time-remaining flex items-center text-sm font-medium text-orange-600">
                      <Clock size={14} className="mr-1"/>
                      Temps restant: {getRemainingTime(quiz.datePublication)}
                    </span>
                        <button
                            className="btn btn-primary px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-300"
                            onClick={() => navigate(`/student/take-quiz/${quiz.id}`)}
                        >
                          Commencer le Quiz
                        </button>
                      </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </Layout>
  );
};

export default StudentQuizzes;