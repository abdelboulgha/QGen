// components/student/QuizTaking.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const QuizTaking = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [confirmEndModal, setConfirmEndModal] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock quiz data
        const mockQuiz = {
          id: quizId,
          title: 'Introduction à JavaScript',
          description: 'Les bases du langage JavaScript pour les débutants',
          timeLimit: 30, // minutes
          createdBy: 'Prof. Dupont',
          questions: [
            {
              id: 'q1',
              text: 'Quelle est la syntaxe correcte pour faire référence à un script externe appelé "script.js"?',
              type: 'multiple_choice',
              points: 1,
              options: [
                { id: 'o1', text: '<script href="script.js">', isCorrect: false },
                { id: 'o2', text: '<script name="script.js">', isCorrect: false },
                { id: 'o3', text: '<script src="script.js">', isCorrect: true },
                { id: 'o4', text: '<script file="script.js">', isCorrect: false }
              ]
            },
            {
              id: 'q2',
              text: 'Comment écrire "Hello World" dans une boîte d\'alerte?',
              type: 'multiple_choice',
              points: 1,
              options: [
                { id: 'o1', text: 'msgBox("Hello World");', isCorrect: false },
                { id: 'o2', text: 'alertBox("Hello World");', isCorrect: false },
                { id: 'o3', text: 'msg("Hello World");', isCorrect: false },
                { id: 'o4', text: 'alert("Hello World");', isCorrect: true }
              ]
            },
            {
              id: 'q3',
              text: 'Comment créer une fonction en JavaScript?',
              type: 'multiple_choice',
              points: 1,
              options: [
                { id: 'o1', text: 'function = myFunction() {}', isCorrect: false },
                { id: 'o2', text: 'function myFunction() {}', isCorrect: true },
                { id: 'o3', text: 'function:myFunction() {}', isCorrect: false },
                { id: 'o4', text: 'function.myFunction() {}', isCorrect: false }
              ]
            },
            {
              id: 'q4',
              text: 'Comment appeler une fonction nommée "myFunction"?',
              type: 'multiple_choice',
              points: 1,
              options: [
                { id: 'o1', text: 'call myFunction()', isCorrect: false },
                { id: 'o2', text: 'call function myFunction()', isCorrect: false },
                { id: 'o3', text: 'myFunction()', isCorrect: true },
                { id: 'o4', text: 'execute myFunction()', isCorrect: false }
              ]
            },
            {
              id: 'q5',
              text: 'Quelles sont les méthodes de tableau en JavaScript? (plusieurs réponses possibles)',
              type: 'checkbox',
              points: 2,
              options: [
                { id: 'o1', text: 'push()', isCorrect: true },
                { id: 'o2', text: 'pull()', isCorrect: false },
                { id: 'o3', text: 'pop()', isCorrect: true },
                { id: 'o4', text: 'shift()', isCorrect: true },
                { id: 'o5', text: 'replace()', isCorrect: false }
              ]
            }
          ]
        };
        
        setQuiz(mockQuiz);
        setQuestions(mockQuiz.questions);
        setTimeLeft(mockQuiz.timeLimit * 60); // Convert minutes to seconds
        setLoading(false);
        
        // Initialize answers object
        const initialAnswers = {};
        mockQuiz.questions.forEach(question => {
          initialAnswers[question.id] = question.type === 'multiple_choice' ? null : [];
        });
        setAnswers(initialAnswers);
        
      } catch (error) {
        console.error("Error fetching quiz:", error);
        // Handle error appropriately
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
          // Auto submit when time runs out
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

  // Submit quiz
  const handleSubmitQuiz = async () => {
    setConfirmEndModal(false);
    
    // Calculate results
    let totalPoints = 0;
    let earnedPoints = 0;
    let correctAnswers = 0;
    
    const questionResults = questions.map(question => {
      totalPoints += question.points;
      let isCorrect = false;
      
      if (question.type === 'multiple_choice') {
        const selectedOption = question.options.find(opt => opt.id === answers[question.id]);
        isCorrect = selectedOption?.isCorrect || false;
      } else if (question.type === 'checkbox') {
        // For checkbox, all correct options must be selected and no incorrect ones
        const selectedOptions = answers[question.id] || [];
        const correctOptionIds = question.options.filter(opt => opt.isCorrect).map(opt => opt.id);
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
    
    // Mock result data
    const mockResults = {
      quizId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      submittedAt: new Date().toISOString(),
      score: scorePercentage,
      totalPoints,
      earnedPoints,
      correctAnswers,
      totalQuestions: questions.length,
      timeSpent: quiz.timeLimit * 60 - timeLeft,
      questionResults
    };
    
    // Simulate sending results to server
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setResults(mockResults);
    setQuizSubmitted(true);
  };

  // Navigate to results view
  const viewDetailedResults = () => {
    navigate(`/student/results/${quizId}`);
  };

  // Return to dashboard
  const returnToDashboard = () => {
    navigate('/student');
  };

  if (loading) {
    return <div className="loading">Chargement du quiz...</div>;
  }

  // Show results after submission
  if (quizSubmitted && results) {
    return (
      <div className="content-area">
        <div className="quiz-results">
          <h1>Quiz terminé!</h1>
          
          <div className="result-summary">
            <h2>Votre score: <span className="score">{results.score}%</span></h2>
            <p>Vous avez obtenu {results.earnedPoints} points sur un total de {results.totalPoints} points.</p>
            <p>Réponses correctes: {results.correctAnswers} sur {results.totalQuestions} questions</p>
            <p>Temps utilisé: {formatTime(results.timeSpent)}</p>
          </div>
          
          <div className="result-actions">
            <button className="btn btn-primary" onClick={viewDetailedResults}>
              Voir les résultats détaillés
            </button>
            <button className="btn btn-secondary" onClick={returnToDashboard}>
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="content-area">
        <div className="quiz-intro">
          <h1>{quiz.title}</h1>
          <div className="quiz-description">
            <p>{quiz.description}</p>
          </div>
          
          <div className="quiz-info">
            <div className="info-item">
              <span className="label">Temps limite:</span>
              <span className="value">{quiz.timeLimit} minutes</span>
            </div>
            <div className="info-item">
              <span className="label">Questions:</span>
              <span className="value">{questions.length}</span>
            </div>
            <div className="info-item">
              <span className="label">Créé par:</span>
              <span className="value">{quiz.createdBy}</span>
            </div>
          </div>
          
          <div className="quiz-instructions">
            <h3>Instructions:</h3>
            <ul>
              <li>Répondez à toutes les questions avant de soumettre le quiz.</li>
              <li>Vous pouvez naviguer entre les questions en utilisant les boutons Précédent et Suivant.</li>
              <li>Le quiz sera automatiquement soumis lorsque le temps sera écoulé.</li>
              <li>Ne rafraîchissez pas la page pendant le quiz, cela pourrait entraîner la perte de vos réponses.</li>
            </ul>
          </div>
          
          <button className="btn btn-primary btn-lg" onClick={handleStartQuiz}>
            Commencer le Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz in progress
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="content-area quiz-container">
      <div className="quiz-header">
        <h1>{quiz.title}</h1>
        <div className="quiz-timer">
          <span className={timeLeft < 60 ? 'time-warning' : ''}>
            Temps restant: {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      
      <div className="quiz-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${Object.values(answers).filter(a => a !== null && (!Array.isArray(a) || a.length > 0)).length / questions.length * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Question {currentQuestionIndex + 1} sur {questions.length}
        </div>
      </div>
      
      <div className="quiz-content">
        <div className="question-sidebar">
          <div className="question-navigation">
            <h3>Questions</h3>
            <div className="question-buttons">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  className={`question-button ${currentQuestionIndex === index ? 'active' : ''} ${isQuestionAnswered(q.id) ? 'answered' : ''}`}
                  onClick={() => jumpToQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="question-main">
          <div className="question-content">
            <h2 className="question-text">{currentQuestion.text}</h2>
            
            <div className="options-list">
              {currentQuestion.type === 'multiple_choice' ? (
                // Multiple choice (radio buttons)
                currentQuestion.options.map(option => (
                  <div 
                    key={option.id} 
                    className={`option-item ${answers[currentQuestion.id] === option.id ? 'selected' : ''}`}
                    onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                  >
                    <div className="option-radio">
                      <div className="radio-inner"></div>
                    </div>
                    <div className="option-text">{option.text}</div>
                  </div>
                ))
              ) : (
                // Checkbox (multiple selection)
                currentQuestion.options.map(option => (
                  <div 
                    key={option.id} 
                    className={`option-item checkbox ${(answers[currentQuestion.id] || []).includes(option.id) ? 'selected' : ''}`}
                  >
                    <div 
                      className="option-checkbox"
                      onClick={() => handleCheckboxAnswer(
                        currentQuestion.id, 
                        option.id, 
                        !(answers[currentQuestion.id] || []).includes(option.id)
                      )}
                    >
                      {(answers[currentQuestion.id] || []).includes(option.id) && (
                        <div className="checkbox-inner"></div>
                      )}
                    </div>
                    <div className="option-text">{option.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="question-actions">
            <button 
              className="btn btn-secondary" 
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Précédent
            </button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button 
                className="btn btn-primary" 
                onClick={nextQuestion}
              >
                Suivant
              </button>
            ) : (
              <button 
                className="btn btn-success" 
                onClick={openConfirmEndModal}
              >
                Terminer le Quiz
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {confirmEndModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Terminer le Quiz</h2>
            <p>Êtes-vous sûr de vouloir terminer et soumettre ce quiz?</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeConfirmEndModal}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleSubmitQuiz}>
                Terminer et Soumettre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTaking;