import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Printer, 
  FileText, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  BarChart, 
  Users, 
  Award, 
  AlertTriangle 
} from 'lucide-react';

// Register Chart.js components
Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const QuizDetails = () => {
  const { quizId: paramQuizId } = useParams();
  const quizId = paramQuizId || "q1"; // Default quiz ID
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [statistics, setStatistics] = useState({
    attempts: 0,
    avgScore: 0,
    highestScore: 0,
    lowestScore: 0,
    medianScore: 0,
    completionRate: 0
  });
  const [chartRef, setChartRef] = useState(null);

  useEffect(() => {
    // Simulate loading delay and fetch quiz data
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const selectedQuiz = quizzesData.quizzes.find(q => q.id === quizId);
      if (selectedQuiz) {
        // Mock statistics for the quiz
        const mockStats = {
          attempts: 50,
          avgScore: 75,
          highestScore: 95,
          lowestScore: 50,
          medianScore: 78,
          completionRate: 90
        };
        setQuiz(selectedQuiz);
        setStatistics(mockStats);
      }
      setLoading(false);
    };

    fetchData();
  }, [quizId]);

  useEffect(() => {
    if (!loading && chartRef) {
      // Create a performance chart
      const ctx = chartRef.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Tentatives', 'Score Moyen', 'Score Max', 'Score Min', 'Médiane'],
          datasets: [{
            label: 'Statistiques (%)',
            data: [
              statistics.attempts,
              statistics.avgScore,
              statistics.highestScore,
              statistics.lowestScore,
              statistics.medianScore
            ],
            backgroundColor: [
              'rgba(52, 211, 153, 0.8)',
              'rgba(251, 191, 36, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(96, 165, 250, 0.8)'
            ],
            borderColor: [
              'rgb(16, 185, 129)',
              'rgb(245, 158, 11)',
              'rgb(5, 150, 105)',
              'rgb(220, 38, 38)',
              'rgb(59, 130, 246)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.raw}%`;
                }
              }
            }
          }
        }
      });
    }
  }, [loading, chartRef, statistics]);

  if (loading) {
    return (
      <div className="layout-with-sidebar">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Chargement des détails du quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="layout-with-sidebar">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz non trouvé</h1>
            <p className="text-gray-600 mb-6">Le quiz que vous recherchez n'existe pas ou a été supprimé.</p>
            <Link 
              to="/professor/manage-quiz" 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-with-sidebar quiz-details-container">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 quiz-header">
          <h1 className="text-3xl font-bold text-gray-800">Détails du Quiz</h1>
          <Link 
            to="/professor/manage-quiz" 
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux Quiz
          </Link>
        </div>

        <div className="quiz-card bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-blue-600 scale-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>Créé le: {quiz.createdAt}</span>
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2 text-gray-400" />
              <span>Questions: {quiz.questionsCount}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span>Temps limite: {quiz.timeLimit} minutes</span>
            </div>
          </div>
        </div>

        <div className="chart-container bg-white rounded-xl shadow-md p-6 mb-8 fade-in">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Statistiques du Quiz</h2>
          <div className="aspect-video w-full">
            <canvas ref={setChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 fade-in">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Exporter les Résultats</h2>
          <div className="flex flex-wrap gap-4">
            <button className="export-button flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Exporter en CSV
            </button>
            <button className="export-button flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              Exporter en PDF
            </button>
            <button className="export-button flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;