import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Book, 
  Users, 
  CheckSquare, 
  Award, 
  Plus, 
  Calendar,
  Search,
  CheckCircle,
  Clock
} from 'lucide-react';
import Layout from '../common/Layout';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalAttempted: 0,
    averageScore: 0,
    completionRate: 0,
    bestScore: 0
  });
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock available quizzes data
        const mockAvailableQuizzes = [
          {
            id: 'q1',
            title: 'Introduction à JavaScript',
            description: 'Les bases du langage JavaScript pour les débutants',
            createdBy: 'Prof. Dupont',
            createdAt: '2025-04-25',
            timeLimit: 30,
            questionsCount: 15,
            dueDate: '2025-05-10',
            category: 'Web Development'
          },
          {
            id: 'q2',
            title: 'Les bases de React',
            description: 'Comprendre les concepts fondamentaux de React',
            createdBy: 'Prof. Dupont',
            createdAt: '2025-04-20',
            timeLimit: 45,
            questionsCount: 12,
            dueDate: '2025-05-15',
            category: 'Web Development'
          },
          {
            id: 'q4',
            title: 'Introduction à Python',
            description: 'Les bases du langage Python pour les débutants',
            createdBy: 'Prof. Martin',
            createdAt: '2025-04-10',
            timeLimit: 40,
            questionsCount: 18,
            dueDate: '2025-05-20',
            category: 'Programming'
          }
        ];
        
        // Mock completed quizzes data
        const mockCompletedQuizzes = [
          {
            id: 'q3',
            title: 'CSS Avancé',
            description: 'Techniques avancées de CSS pour le design web moderne',
            createdBy: 'Prof. Garcia',
            attemptedAt: '2025-04-28',
            timeLimit: 35,
            questionsCount: 20,
            score: 72,
            totalPoints: 20,
            earnedPoints: 14.4,
            category: 'Web Development'
          },
          {
            id: 'q5',
            title: 'Bases de données SQL',
            description: 'Introduction aux bases de données relationnelles',
            createdBy: 'Prof. Li',
            attemptedAt: '2025-04-22',
            timeLimit: 50,
            questionsCount: 22,
            score: 88,
            totalPoints: 22,
            earnedPoints: 19.36,
            category: 'Databases'
          }
        ];

        // Mock upcoming quizzes (scheduled but not yet available)
        const mockUpcomingQuizzes = [
          {
            id: 'q6',
            title: 'Algorithmes et Structures de Données',
            description: 'Les algorithmes fondamentaux et structures de données en informatique',
            createdBy: 'Prof. Johnson',
            availableFrom: '2025-05-15',
            availableTo: '2025-05-30',
            timeLimit: 60,
            questionsCount: 25,
            category: 'Computer Science'
          },
          {
            id: 'q7',
            title: 'Sécurité Web',
            description: 'Principes de base de la sécurité des applications web',
            createdBy: 'Prof. Garcia',
            availableFrom: '2025-05-20',
            availableTo: '2025-06-05',
            timeLimit: 45,
            questionsCount: 18,
            category: 'Web Development'
          }
        ];
        
        // Calculate overall statistics
        const totalAttempted = mockCompletedQuizzes.length;
        const averageScore = mockCompletedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / 
                            (totalAttempted || 1);
        const completionRate = (totalAttempted / (totalAttempted + mockAvailableQuizzes.length)) * 100;
        const bestScore = Math.max(...mockCompletedQuizzes.map(quiz => quiz.score), 0);
        
        setAvailableQuizzes(mockAvailableQuizzes);
        setCompletedQuizzes(mockCompletedQuizzes);
        setUpcomingQuizzes(mockUpcomingQuizzes);
        setStats({
          totalAttempted,
          averageScore,
          completionRate,
          bestScore
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter quizzes based on search term
  const filterQuizzes = (quizzes) => {
    if (!searchTerm) return quizzes;
    
    return quizzes.filter(quiz => 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Calculate days left until due date
  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get appropriate label color based on days left
  const getDueDateClass = (daysLeft) => {
    if (daysLeft <= 1) return 'text-red-500';
    if (daysLeft <= 3) return 'text-orange-500';
    return 'text-green-500';
  };

  // Get appropriate label color based on score
  const getScoreClass = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <Layout title="Tableau de Bord Étudiant" userRole="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement du tableau de bord...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Tableau de Bord Étudiant" userRole="student">
      <div className="flex flex-col p-0 m-0 pl-6"> {/* Augmenté le padding-left à pl-6 */}
        {/* Message de bienvenue aligné à gauche */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Bienvenue, {currentUser?.name || 'Étudiant'}!</h2>
        </div>
    
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { title: 'Meilleur Score', icon: <Award size={20} color="#fbbc05" />, value: `${stats.bestScore}%` },
            { title: 'Taux de Complétion', icon: <CheckSquare size={20} color="#ea4335" />, value: `${stats.completionRate.toFixed(0)}%` },
            { title: 'Score Moyen', icon: <Award size={20} color="#4285f4" />, value: `${stats.averageScore.toFixed(1)}%` },
            { title: 'Quiz Terminés', icon: <CheckCircle size={20} color="#2ac3a2" />, value: stats.totalAttempted }
          ].map((card, idx) => (
            <div className="bg-white rounded-lg shadow p-4" key={idx}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                {card.icon}
              </div>
              <div className="mt-1">
                <p className="text-2xl font-semibold">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
    
        {/* Cartes des quiz */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Augmentez le gap ici */}
            {filterQuizzes(availableQuizzes).map(quiz => {
              const daysLeft = getDaysLeft(quiz.dueDate);
              return (
                <div className="bg-white rounded-lg shadow overflow-hidden" key={quiz.id}>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4"> {/* Ajout d'un espace ici */}
                      <h3 className="text-lg font-medium line-clamp-1">{quiz.title}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{quiz.category}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Créé par:</span>
                        <p>{quiz.createdBy}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Questions:</span>
                        <p>{quiz.questionsCount}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Temps:</span>
                        <p>{quiz.timeLimit} min</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Date limite:</span>
                        <p className={getDueDateClass(daysLeft)}>
                          {formatDate(quiz.dueDate)}
                          <span className="block text-xs">({daysLeft} jours restants)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 border-t">
                    <Link
                      to={`/student/quiz/${quiz.id}`}
                      className="block w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-center rounded transition-colors"
                    >
                      Commencer
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default StudentDashboard;