// components/student/ResultsView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ResultsView = () => {
  const { quizId } = useParams();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock quiz data
        const mockQuiz = {
          id: quizId,
          title: 'Introduction à JavaScript',
          description: 'Les bases du langage JavaScript pour les débutants',
          createdBy: 'Prof. Dupont',
          timeLimit: 30,
          totalQuestions: 5
        };
        
        // Mock result data
        const mockResult = {
          id: 'r123',
          quizId,
          studentId: currentUser.id,
          studentName: currentUser.name,
          startedAt: '2025-05-03T14:22:17',
          completedAt: '2025-05-03T14:48:42',
          score: 78,
          totalPoints: 6,
          earnedPoints: 4.5,
          timeSpent: 1585, // in seconds
          questions: [
            {
              id: 'q1',
              text: 'Quelle est la syntaxe correcte pour faire référence à un script externe appelé "script.js"?',
              type: 'multiple_choice',
              points: 1,
              earnedPoints: 1,
              isCorrect: true,
              options: [
                { id: 'o1', text: '<script href="script.js">', isCorrect: false, selected: false },
                { id: 'o2', text: '<script name="script.js">', isCorrect: false, selected: false },
                { id: 'o3', text: '<script src="script.js">', isCorrect: true, selected: true },
                { id: 'o4', text: '<script file="script.js">', isCorrect: false, selected: false }
              ],
              explanation: 'La balise script utilise l\'attribut "src" pour spécifier le chemin vers un fichier JavaScript externe.'
            },
            {
              id: 'q2',
              text: 'Comment écrire "Hello World" dans une boîte d\'alerte?',
              type: 'multiple_choice',
              points: 1,
              earnedPoints: 1,
              isCorrect: true,
              options: [
                { id: 'o1', text: 'msgBox("Hello World");', isCorrect: false, selected: false },
                { id: 'o2', text: 'alertBox("Hello World");', isCorrect: false, selected: false },
                { id: 'o3', text: 'msg("Hello World");', isCorrect: false, selected: false },
                { id: 'o4', text: 'alert("Hello World");', isCorrect: true, selected: true }
              ],
              explanation: 'La fonction alert() est utilisée pour afficher une boîte d\'alerte avec un message spécifié.'
            },
            {
              id: 'q3',
              text: 'Comment créer une fonction en JavaScript?',
              type: 'multiple_choice',
              points: 1,
              earnedPoints: 0,
              isCorrect: false,
              options: [
                { id: 'o1', text: 'function = myFunction() {}', isCorrect: false, selected: true },
                { id: 'o2', text: 'function myFunction() {}', isCorrect: true, selected: false },
                { id: 'o3', text: 'function:myFunction() {}', isCorrect: false, selected: false },
                { id: 'o4', text: 'function.myFunction() {}', isCorrect: false, selected: false }
              ],
              explanation: 'La syntaxe correcte pour déclarer une fonction en JavaScript est "function nomDeLaFonction() {}".'
            },
            {
              id: 'q4',
              text: 'Comment appeler une fonction nommée "myFunction"?',
              type: 'multiple_choice',
              points: 1,
              earnedPoints: 1,
              isCorrect: true,
              options: [
                { id: 'o1', text: 'call myFunction()', isCorrect: false, selected: false },
                { id: 'o2', text: 'call function myFunction()', isCorrect: false, selected: false },
                { id: 'o3', text: 'myFunction()', isCorrect: true, selected: true },
                { id: 'o4', text: 'execute myFunction()', isCorrect: false, selected: false }
              ],
              explanation: 'Pour appeler une fonction en JavaScript, il suffit d\'écrire le nom de la fonction suivi de parenthèses.'
            },
            {
              id: 'q5',
              text: 'Quelles sont les méthodes de tableau en JavaScript? (plusieurs réponses possibles)',
              type: 'checkbox',
              points: 2,
              earnedPoints: 1.5,
              isCorrect: false,
              options: [
                { id: 'o1', text: 'push()', isCorrect: true, selected: true },
                { id: 'o2', text: 'pull()', isCorrect: false, selected: true },
                { id: 'o3', text: 'pop()', isCorrect: true, selected: true },
                { id: 'o4', text: 'shift()', isCorrect: true, selected: true },
                { id: 'o5', text: 'replace()', isCorrect: false, selected: false }
              ],
              explanation: 'Les méthodes de tableau en JavaScript incluent push(), pop(), shift(), unshift(), splice(), slice(), etc. mais pas pull() ou replace().'
            }
          ]
        };
        
        setQuiz(mockQuiz);
        setQuizResult(mockResult);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [quizId, currentUser.id, currentUser.name]);

  // Format time from seconds to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR');
  };

  // Toggle question expansion
  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  if (loading) {
    return <div className="loading">Chargement des résultats...</div>;
  }

  if (!quizResult) {
    return (
      <div className="content-area">
        <h1>Résultats non disponibles</h1>
        <p>Les résultats pour ce quiz n'ont pas été trouvés.</p>
        <Link to="/student" className="btn btn-primary">Retour au tableau de bord</Link>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="header-actions">
        <h1>Résultats du Quiz</h1>
        <Link to="/student" className="btn btn-secondary">Retour au tableau de bord</Link>
      </div>

      <div className="quiz-info-banner">
        <h2>{quiz.title}</h2>
        <p>{quiz.description}</p>
        <div className="quiz-meta">
          <span>Créé par: {quiz.createdBy}</span>
          <span>Temps limite: {quiz.timeLimit} minutes</span>
        </div>
      </div>

      <div className="result-summary">
        <div className="statistics-cards">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Score</h3>
            </div>
            <div className="card-content">
              <p className={`stat-number ${quizResult.score >= 80 ? 'high' : quizResult.score >= 60 ? 'medium' : 'low'}`}>
                {quizResult.score}%
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Points</h3>
            </div>
            <div className="card-content">
              <p className="stat-number">{quizResult.earnedPoints}/{quizResult.totalPoints}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Date de complétion</h3>
            </div>
            <div className="card-content">
              <p className="stat-text">{formatDate(quizResult.completedAt)}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Temps utilisé</h3>
            </div>
            <div className="card-content">
              <p className="stat-text">{formatTime(quizResult.timeSpent)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section mt-4">
        <h2>Détail des Réponses</h2>

        <div className="questions-review">
          {quizResult.questions.map((question, index) => (
            <div className={`question-card ${question.isCorrect ? 'correct' : 'incorrect'}`} key={question.id}>
              <div 
                className="question-header" 
                onClick={() => toggleQuestion(question.id)}
              >
                <h3>
                  <span className="question-number">Question {index + 1}</span>
                  {question.isCorrect ? 
                    <span className="status-indicator correct">Correct</span> : 
                    <span className="status-indicator incorrect">Incorrect</span>
                  }
                </h3>
                <div className="question-points">
                  {question.earnedPoints}/{question.points} points
                </div>
                <div className="expand-icon">
                  {expandedQuestions[question.id] ? '▼' : '►'}
                </div>
              </div>

              {expandedQuestions[question.id] && (
                <div className="question-details">
                  <p className="question-text">{question.text}</p>
                  
                  <div className="options-list">
                    {question.options.map(option => (
                      <div 
                        key={option.id} 
                        className={`
                          option 
                          ${option.selected ? 'selected' : ''} 
                          ${option.isCorrect ? 'correct' : ''} 
                          ${option.selected && !option.isCorrect ? 'wrong' : ''}
                        `}
                      >
                        {question.type === 'checkbox' ? (
                          <span className="checkbox">
                            {option.selected ? '☑' : '☐'}
                          </span>
                        ) : (
                          <span className="radio">
                            {option.selected ? '●' : '○'}
                          </span>
                        )}
                        <span className="option-text">{option.text}</span>
                        {option.isCorrect && <span className="correct-mark">✓</span>}
                      </div>
                    ))}
                  </div>
                  
                  {question.explanation && (
                    <div className="explanation">
                      <h4>Explication:</h4>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="actions mt-4">
        <Link to="/student" className="btn btn-primary">
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
};

export default ResultsView;