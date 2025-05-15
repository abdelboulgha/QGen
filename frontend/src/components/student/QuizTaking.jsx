import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../common/Layout';
import axios from 'axios';

// Correction : Utilisation du port 8080 comme dans votre test Postman
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 15000 // 15 seconds timeout
});

const QuizTaking = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState('Chargement du quiz...');
  const [loadingTime, setLoadingTime] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [confirmEndModal, setConfirmEndModal] = useState(false);
  const [error, setError] = useState(null);
  
  // État pour stocker les options de chaque question
  const [questionOptions, setQuestionOptions] = useState({});

  // Tracking loading time
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setLoadingTime(prev => {
          const newTime = prev + 1;
          if (newTime > 3 && newTime <= 8) {
            setLoadingProgress('Récupération des données du quiz... Veuillez patienter...');
          } else if (newTime > 8) {
            setLoadingProgress('Le serveur met plus de temps que prévu à répondre. Merci de patienter...');
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loading]);

  // Check if quiz is cached in sessionStorage
  const getCachedQuiz = () => {
    const cachedData = sessionStorage.getItem(`quiz_${quizId}`);
    if (cachedData) {
      try {
        return JSON.parse(cachedData);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Fonction pour extraire l'ID numérique d'une question
  const extractNumericId = (id) => {
    // Si l'ID est déjà un nombre, le retourner
    if (typeof id === 'number') return id;
    
    // Si l'ID est au format "qX", extraire le numéro
    if (typeof id === 'string' && id.startsWith('q')) {
      return parseInt(id.substring(1), 10);
    }
    
    // Sinon, essayer de le convertir en nombre
    const numId = parseInt(id, 10);
    return isNaN(numId) ? id : numId;
  };

  // Charger les options pour la question actuelle
  useEffect(() => {
    if (!quizStarted || !questions[currentQuestionIndex]) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const questionId = extractNumericId(currentQuestion.id);
    
    // Si on a déjà les options pour cette question, ne pas les recharger
    if (questionOptions[currentQuestion.id]) return;
    
    const fetchOptions = async () => {
      try {
        console.log(`Fetching options for question ID: ${questionId}`);
        const response = await api.get(`/question-options/question/${questionId}`);
        console.log('Options API response:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          // Mettre à jour l'état avec les nouvelles options
          setQuestionOptions(prev => ({
            ...prev,
            [currentQuestion.id]: response.data.map(option => ({
              id: option.id,
              text: option.valeurReponse,
              isCorrect: option.estCorrecte,
              feedback: option.feedback
            }))
          }));
        }
      } catch (error) {
        console.error(`Error fetching options for question ${questionId}:`, error);
      }
    };
    
    fetchOptions();
  }, [currentQuestionIndex, questions, quizStarted, questionOptions]);

  // Fetch quiz data from API
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check for cached quiz first
        const cachedQuiz = getCachedQuiz();
        if (cachedQuiz) {
          console.log("Using cached quiz data");
          setQuiz(cachedQuiz);
          setQuestions(cachedQuiz.questions);
          setTimeLeft(cachedQuiz.timeLimit * 60);
          
          // Initialize answers object from cache
          const initialAnswers = {};
          cachedQuiz.questions.forEach(question => {
            initialAnswers[question.id] = question.type === 'multiple_choice' ? null : [];
          });
          setAnswers(initialAnswers);
          
          setLoading(false);
          return;
        }
        
        // No cache, fetch from API
        setLoadingProgress('Connexion au serveur...');
        const response = await api.get(`/quizzes/${quizId}`);
        console.log("API Response quizzes:", response.data);
        
        if (!response.data) {
          throw new Error('Empty response from server');
        }

        const quizData = response.data;
        
        // Transformer les données du quiz, mais sans charger les options immédiatement
        const transformedQuiz = {
          id: quizData.id,
          title: quizData.titre || "Quiz sans titre",
          description: quizData.description || "Aucune description disponible",
          timeLimit: quizData.duree || 20, // minutes, default to 20
          createdBy: quizData.createur ? `${quizData.createur.prenom} ${quizData.createur.nom}` : 'Unknown',
          questions: quizData.questions.map((q, index) => ({
            id: q.id, // Utiliser l'ID réel de la question
            text: q.enonce || `Question ${index + 1}`,
            type: q.typeQuestion === 'MULTIPLE' ? 'multiple_choice' : 'checkbox',
            points: q.points || 1,
            // Les options seront chargées séparément
            options: []
          }))
        };

        // Cache the quiz data
        sessionStorage.setItem(`quiz_${quizId}`, JSON.stringify(transformedQuiz));

        setQuiz(transformedQuiz);
        setQuestions(transformedQuiz.questions);
        setTimeLeft(transformedQuiz.timeLimit * 60); // Convert minutes to seconds

        // Initialize answers object
        const initialAnswers = {};
        transformedQuiz.questions.forEach(question => {
          initialAnswers[question.id] = question.type === 'multiple_choice' ? null : [];
        });
        setAnswers(initialAnswers);

      } catch (error) {
        console.error("Error fetching quiz:", error);
        if (error.code === 'ECONNABORTED') {
          setError({
            message: "La requête a pris trop de temps. Veuillez vérifier votre connexion internet ou réessayer plus tard.",
            status: 'timeout'
          });
        } else {
          setError({
            message: error.response?.data?.message || "Échec du chargement du quiz",
            status: error.response?.status
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted || quizSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizSubmitted, timeLeft]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle starting the quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  // Handle answer selection for multiple choice
  const handleSelectAnswer = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Handle answer selection for checkbox (multiple answers)
  const handleCheckboxAnswer = (questionId, optionId, isChecked) => {
    setAnswers(prev => {
      const currentAnswers = [...(prev[questionId] || [])];

      if (isChecked) {
        // Add the option if checked
        return {
          ...prev,
          [questionId]: [...currentAnswers, optionId]
        };
      } else {
        // Remove the option if unchecked
        return {
          ...prev,
          [questionId]: currentAnswers.filter(id => id !== optionId)
        };
      }
    });
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Move to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Jump to specific question
  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Check if question is answered
  const isQuestionAnswered = (questionId) => {
    const answer = answers[questionId];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return answer !== null;
  };

  // Open confirm end modal
  const openConfirmEndModal = () => {
    setConfirmEndModal(true);
  };

  // Close confirm end modal
  const closeConfirmEndModal = () => {
    setConfirmEndModal(false);
  };

  // Fonction pour recharger manuellement les options de la question actuelle
  const reloadCurrentQuestionOptions = async () => {
    if (!questions[currentQuestionIndex]) return;
    
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const questionId = extractNumericId(currentQuestion.id);
      
      console.log(`Manually reloading options for question ID ${questionId}`);
      
      const response = await api.get(`/question-options/question/${questionId}`);
      console.log('Options reloaded:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setQuestionOptions(prev => ({
          ...prev,
          [currentQuestion.id]: response.data.map(option => ({
            id: option.id,
            text: option.valeurReponse,
            isCorrect: option.estCorrecte,
            feedback: option.feedback
          }))
        }));
      }
    } catch (error) {
      console.error('Error reloading options:', error);
      alert('Erreur lors du chargement des options. Vérifiez la console pour plus de détails.');
    }
  };

  // Submit quiz to API
  const handleSubmitQuiz = async () => {
    setConfirmEndModal(false);
    setLoading(true);
    setLoadingProgress('Enregistrement des réponses...');

    try {
      // Calculate results
      let totalPoints = 0;
      let earnedPoints = 0;
      let correctAnswers = 0;

      const questionResults = questions.map(question => {
        totalPoints += question.points;
        let isCorrect = false;
        
        // Récupérer les options pour cette question
        const options = questionOptions[question.id] || [];

        if (question.type === 'multiple_choice') {
          const selectedOption = options.find(opt => opt.id === answers[question.id]);
          isCorrect = selectedOption?.isCorrect || false;
        } else if (question.type === 'checkbox') {
          // For checkbox, all correct options must be selected and no incorrect ones
          const selectedOptions = answers[question.id] || [];
          const correctOptionIds = options.filter(opt => opt.isCorrect).map(opt => opt.id);
          const incorrectSelections = selectedOptions.filter(id => !correctOptionIds.includes(id));
          const missingCorrectSelections = correctOptionIds.filter(id => !selectedOptions.includes(id));

          isCorrect = incorrectSelections.length === 0 && missingCorrectSelections.length === 0 && selectedOptions.length > 0;
        }

        if (isCorrect) {
          earnedPoints += question.points;
          correctAnswers++;
        }

        return {
          questionId: question.id,
          isCorrect,
          points: isCorrect ? question.points : 0,
          answer: answers[question.id],
          correctOptions: options.filter(opt => opt.isCorrect).map(opt => opt.id),
          feedback: isCorrect 
            ? options.find(opt => opt.id === answers[question.id])?.feedback || "Bonne réponse!"
            : "Réponse incorrecte"
        };
      });

      const scorePercentage = Math.round((earnedPoints / totalPoints) * 100);
      const timeSpent = quiz.timeLimit * 60 - timeLeft;

      // Prepare data to send to API
      const submissionData = {
        quizId,
        studentId: currentUser.id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId: extractNumericId(questionId),
          answer: Array.isArray(answer) ? answer : [answer].filter(a => a !== null)
        })),
        timeSpent,
        score: scorePercentage
      };

      // Send results to server with timeout
      console.log('Submitting quiz data:', submissionData);
      const response = await api.post('/quiz-submissions', submissionData);

      // Set results for display
      setResults({
        quizId,
        studentId: currentUser.id,
        studentName: currentUser.name,
        submittedAt: new Date().toISOString(),
        score: scorePercentage,
        totalPoints,
        earnedPoints,
        correctAnswers,
        totalQuestions: questions.length,
        timeSpent,
        questionResults
      });

      setQuizSubmitted(true);

    } catch (error) {
      console.error("Error submitting quiz:", error);
      
      // Créer des résultats locaux même en cas d'erreur d'API
      let totalPoints = 0;
      let earnedPoints = 0;
      let correctAnswers = 0;

      const questionResults = questions.map(question => {
        totalPoints += question.points;
        let isCorrect = false;
        
        // Récupérer les options pour cette question
        const options = questionOptions[question.id] || [];

        if (question.type === 'multiple_choice') {
          const selectedOption = options.find(opt => opt.id === answers[question.id]);
          isCorrect = selectedOption?.isCorrect || false;
        } else if (question.type === 'checkbox') {
          const selectedOptions = answers[question.id] || [];
          const correctOptionIds = options.filter(opt => opt.isCorrect).map(opt => opt.id);
          const incorrectSelections = selectedOptions.filter(id => !correctOptionIds.includes(id));
          const missingCorrectSelections = correctOptionIds.filter(id => !selectedOptions.includes(id));

          isCorrect = incorrectSelections.length === 0 && missingCorrectSelections.length === 0 && selectedOptions.length > 0;
        }

        if (isCorrect) {
          earnedPoints += question.points;
          correctAnswers++;
        }

        return {
          questionId: question.id,
          isCorrect,
          points: isCorrect ? question.points : 0
        };
      });

      const scorePercentage = Math.round((earnedPoints / totalPoints) * 100);
      const timeSpent = quiz.timeLimit * 60 - timeLeft;

      setResults({
        quizId,
        studentId: currentUser.id,
        studentName: currentUser.name || 'Étudiant',
        submittedAt: new Date().toISOString(),
        score: scorePercentage,
        totalPoints,
        earnedPoints,
        correctAnswers,
        totalQuestions: questions.length,
        timeSpent,
        questionResults,
        notSavedToServer: true
      });

      setQuizSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to results view
  const viewDetailedResults = () => {
    navigate(`/student/results/${quizId}`);
  };

  // Return to dashboard
  const returnToDashboard = () => {
    navigate('/student');
  };

  // Retry loading quiz
  const retryLoadingQuiz = () => {
    // Clear the cached quiz data to force a fresh fetch
    sessionStorage.removeItem(`quiz_${quizId}`);
    window.location.reload();
  };

  if (loading && !quiz) {
    return (
      <Layout title="Chargement du Quiz" userRole="student">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
          <div className="text-center mb-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <h2 className="text-xl font-bold mb-2">{loadingProgress}</h2>
            {loadingTime > 5 && (
              <p className="text-sm text-gray-500">
                Temps d'attente : {loadingTime} secondes
              </p>
            )}
          </div>
          
          {loadingTime > 10 && (
            <div className="mt-4 text-center">
              <p className="text-amber-600 mb-3">
                Le serveur met beaucoup de temps à répondre. Vous pouvez attendre ou réessayer.
              </p>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={retryLoadingQuiz}
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Erreur" userRole="student">
        <div className="max-w-md mx-auto p-6 bg-red-50 rounded-lg shadow">
          <h2 className="text-xl font-bold text-red-600 mb-2">Erreur</h2>
          <p className="text-red-700 mb-4">{error.message}</p>
          
          {error.status === 'timeout' ? (
            <div>
              <p className="text-gray-700 mb-4">
                Le serveur met trop de temps à répondre. Cela peut être dû à une connexion internet lente ou à un problème temporaire avec le serveur.
              </p>
              <div className="flex space-x-3">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={retryLoadingQuiz}
                >
                  Réessayer
                </button>
                <button 
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  onClick={() => navigate('/student')}
                >
                  Retour au tableau de bord
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </button>
          )}
        </div>
      </Layout>
    );
  }

  // Show results after submission
  if (quizSubmitted && results) {
    return (
      <Layout title="Quiz Terminé" userRole="student">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">

          {results.notSavedToServer && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-md">
              <p className="text-yellow-700">
                <strong>Attention:</strong> Vos résultats n'ont pas pu être enregistrés sur le serveur en raison d'un problème de connexion.
                Veuillez prendre une capture d'écran de cette page comme preuve de votre score.
              </p>
            </div>
          )}

          <div className="result-summary mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Votre score: <span className={`text-${results.score >= 60 ? 'green' : 'red'}-600`}>{results.score}%</span>
            </h2>
            <p className="mb-1">Vous avez obtenu {results.earnedPoints} points sur un total de {results.totalPoints} points.</p>
            <p className="mb-1">Réponses correctes: {results.correctAnswers} sur {results.totalQuestions} questions</p>
            <p className="mb-1">Temps utilisé: {formatTime(results.timeSpent)}</p>
          </div>

          <div className="flex space-x-4">
            {!results.notSavedToServer && (
              <button
                  className="btn btn-primary px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-300"
                onClick={viewDetailedResults}
              >
                Voir les résultats détaillés
              </button>
            )}
            <button
                className="btn btn-primary px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-300"
              onClick={returnToDashboard}
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Quiz start screen
  if (!quizStarted && quiz) {
    return (
        <Layout title={quiz.title} userRole="student">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded">
                    <span className="block text-sm text-gray-500">Temps limite:</span>
                    <span className="font-medium">{quiz.timeLimit} minutes</span>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                    <span className="block text-sm text-gray-500">Questions:</span>
                    <span className="font-medium">{questions.length}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded col-span-2">
                    <span className="block text-sm text-gray-500">Créé par:</span>
                    <span className="font-medium">{quiz.createdBy}</span>
                </div>
            </div>

            <div
                className="quiz-instructions mb-8 flex flex-col items-center max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-4 text-center text-indigo-700 border-b-2 border-indigo-200 pb-2 w-full">Instructions:</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 self-start">
                    <li>Répondez à toutes les questions avant de soumettre le quiz.</li>
                    <li>Vous pouvez naviguer entre les questions en utilisant les boutons Précédent et Suivant.</li>
                    <li>Le quiz sera automatiquement soumis lorsque le temps sera écoulé.</li>
                    <li>Ne rafraîchissez pas la page pendant le quiz, cela pourrait entraîner la perte de vos
                        réponses.
                    </li>
                </ul>
            </div>

            <button
                className="btn btn-primary px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-300"
                onClick={handleStartQuiz}
            >
                Commencer le Quiz
            </button>
        </Layout>
    );
  }

    // Quiz in progress
    const currentQuestion = questions[currentQuestionIndex];
    const currentOptions = questionOptions[currentQuestion?.id] || [];

    return (
        <Layout title={quiz?.title} userRole="student">
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <div className={`text-lg font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
                        Temps restant: {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${Object.values(answers).filter(a => a !== null && (!Array.isArray(a) || a.length > 0)).length / questions.length * 100}%`
              }}
            ></div>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Question {currentQuestionIndex + 1} sur {questions.length}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <h3 className="font-semibold mb-3">Questions</h3>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentQuestionIndex === index 
                      ? 'bg-blue-600 text-white' 
                      : isQuestionAnswered(q.id) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                  }`}
                  onClick={() => jumpToQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="question-content mb-6">
              <h2 className="text-lg font-medium mb-4">{currentQuestion?.text}</h2>

              {/* Debug information */}
              <div className="text-xs text-gray-500 mb-2">
                Question ID: {currentQuestion?.id} (ID numérique: {extractNumericId(currentQuestion?.id)})
              </div>
              {/* Options de la question */}
              {currentOptions.length > 0 ? (
                  <div className="space-y-3">
                    {currentQuestion?.type === 'multiple_choice' ? (
                        // Options pour les questions à choix unique - style simplifié comme l'image
                        currentOptions.map(option => (
                            <div
                                key={option.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                    answers[currentQuestion.id] === option.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                                onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                            >
                              <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full border-2 mr-3 flex-shrink-0 ${
                                    answers[currentQuestion.id] === option.id
                                        ? 'border-blue-600'
                                        : 'border-gray-300'
                                }`}>
                                  {answers[currentQuestion.id] === option.id && (
                                      <div className="w-3 h-3 bg-blue-600 rounded-full mx-auto my-auto"></div>
                                  )}
                                </div>
                                <div className="text-base">{option.text}</div>
                              </div>
                            </div>
                        ))
                    ) : (
                        // Options pour les questions à choix multiples - style simplifié comme l'image
                        currentOptions.map(option => (
                            <div
                                key={option.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                    (answers[currentQuestion.id] || []).includes(option.id)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                                onClick={() => handleCheckboxAnswer(
                                    currentQuestion.id,
                                    option.id,
                                    !(answers[currentQuestion.id] || []).includes(option.id)
                                )}
                            >
                              <div className="flex items-center">
                                <div className={`w-6 h-6 border-2 rounded mr-3 flex-shrink-0 ${
                                    (answers[currentQuestion.id] || []).includes(option.id)
                                        ? 'border-blue-600 bg-white'
                                        : 'border-gray-300'
                                }`}>
                                  {(answers[currentQuestion.id] || []).includes(option.id) && (
                                      <svg className="w-4 h-4 text-blue-600 mx-auto my-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                      </svg>
                                  )}
                                </div>
                                <div className="text-base">{option.text}</div>
                              </div>
                            </div>
                        ))
                    )}
                  </div>
              ) : (
                  // Message si aucune option n'est disponible
                  <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md">
                    <p className="text-yellow-700">Les options de réponse ne sont pas disponibles pour cette question. Veuillez vérifier votre connexion API.</p>
                    <div className="mt-4">
                      <button
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={reloadCurrentQuestionOptions}
                      >
                        Charger les options
                      </button>
                      <div className="text-xs text-gray-500 mt-2">
                        Si les options ne s'affichent pas, vérifiez la console (F12) pour plus d'informations.
                      </div>
                    </div>
                  </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Précédent
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                    className="btn btn-primary px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-300"
                  onClick={nextQuestion}
                >
                  Suivant
                </button>
              ) : (
                <button
                    className="btn btn-primary px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-300"
                  onClick={openConfirmEndModal}
                >
                  Terminer le Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
            {confirmEndModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Terminer le Quiz</h2>
                            <p className="text-gray-600 mb-8 mx-auto max-w-sm text-lg">
                                Êtes-vous sûr de vouloir terminer et soumettre ce quiz?
                            </p>
                        </div>

                        <div className="flex justify-center gap-5">
                            <button
                                className="btn btn-primary px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-300"
                                onClick={closeConfirmEndModal}
                            >
                                Annuler
                            </button>
                            <button
                                className="btn btn-primary px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-300"
                                onClick={handleSubmitQuiz}
                            >
                                Terminer et Soumettre
                            </button>
                        </div>
                    </div>
                </div>
            )}
    </Layout>
  );
};

export default QuizTaking;