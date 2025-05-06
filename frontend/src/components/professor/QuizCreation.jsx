import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  PlusCircle, 
  Trash2, 
  Clock, 
  BookOpen,
  HelpCircle,
  X 
} from 'lucide-react';
import Layout from '../common/Layout';
import logoImg from '../../utils/images/logo.png';

const QuizCreation = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    category: '',
    isPublic: true,
    questions: [
      {
        id: 1,
        questionText: '',
        options: [
          { id: 1, text: '', isCorrect: false },
          { id: 2, text: '', isCorrect: false },
          { id: 3, text: '', isCorrect: false },
          { id: 4, text: '', isCorrect: false }
        ],
        explanation: ''
      }
    ]
  });

  // Gestion des changements pour les informations de base du quiz
  const handleQuizInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizData({
      ...quizData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Gestion des changements pour les questions
  const handleQuestionChange = (questionId, field, value) => {
    setQuizData({
      ...quizData,
      questions: quizData.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    });
  };

  // Gestion des changements pour les options de réponse
  const handleOptionChange = (questionId, optionId, field, value) => {
    setQuizData({
      ...quizData,
      questions: quizData.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map(opt => {
              // Si c'est isCorrect, on réinitialise d'abord tous à false
              if (field === 'isCorrect' && value === true) {
                return opt.id === optionId ? { ...opt, isCorrect: true } : { ...opt, isCorrect: false };
              } else {
                return opt.id === optionId ? { ...opt, [field]: value } : opt;
              }
            })
          };
        }
        return q;
      })
    });
  };

  // Ajouter une nouvelle question
  const addQuestion = () => {
    const newQuestionId = quizData.questions.length + 1;
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          id: newQuestionId,
          questionText: '',
          options: [
            { id: 1, text: '', isCorrect: false },
            { id: 2, text: '', isCorrect: false },
            { id: 3, text: '', isCorrect: false },
            { id: 4, text: '', isCorrect: false }
          ],
          explanation: ''
        }
      ]
    });
  };

  // Supprimer une question
  const removeQuestion = (questionId) => {
    if (quizData.questions.length > 1) {
      setQuizData({
        ...quizData,
        questions: quizData.questions.filter(q => q.id !== questionId)
          .map((q, idx) => ({ ...q, id: idx + 1 })) // Réindexer les IDs
      });
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simuler la sauvegarde
    console.log('Quiz data to save:', quizData);
    alert('Quiz créé avec succès!');
    navigate('/professor/manage-quiz');
  };

  // Étapes du processus de création
  const steps = [
    {
      title: 'Informations de base',
      content: (
        <div className="form-container">
          <div className="form-group">
            <label htmlFor="title">Titre du Quiz</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              value={quizData.title} 
              onChange={handleQuizInfoChange} 
              placeholder="Entrez le titre du quiz"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              value={quizData.description} 
              onChange={handleQuizInfoChange} 
              placeholder="Décrivez brièvement ce quiz"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="timeLimit">Temps Limite (minutes)</label>
            <input 
              type="number" 
              id="timeLimit" 
              name="timeLimit" 
              value={quizData.timeLimit} 
              onChange={handleQuizInfoChange} 
              min="1"
              max="120"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Catégorie</label>
            <select 
              id="category" 
              name="category" 
              value={quizData.category} 
              onChange={handleQuizInfoChange}
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="programming">Programmation</option>
              <option value="web">Développement Web</option>
              <option value="database">Base de données</option>
              <option value="design">Design</option>
              <option value="networking">Réseau</option>
              <option value="security">Sécurité</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="isPublic" 
                checked={quizData.isPublic} 
                onChange={handleQuizInfoChange} 
              />
              Quiz public (visible par tous les étudiants)
            </label>
          </div>
        </div>
      )
    },
    {
      title: 'Questions',
      content: (
        <div className="questions-container">
          {quizData.questions.map((question, qIndex) => (
            <div key={question.id} className="question-form">
              <div className="question-header d-flex justify-between align-center">
                <h3>Question {qIndex + 1}</h3>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => removeQuestion(question.id)}
                  disabled={quizData.questions.length === 1}
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
              
              <div className="form-group">
                <label htmlFor={`question-${question.id}`}>Question</label>
                <textarea 
                  id={`question-${question.id}`}
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(question.id, 'questionText', e.target.value)}
                  placeholder="Entrez votre question"
                  rows="2"
                  required
                />
              </div>
              
              <h4>Options de réponse</h4>
              {question.options.map((option) => (
                <div key={option.id} className="option-row">
                  <input 
                    type="radio"
                    id={`option${question.id}-${option.id}`}
                    name={`correct-${question.id}`}
                    checked={option.isCorrect}
                    onChange={() => handleOptionChange(question.id, option.id, 'isCorrect', true)}
                  />
                  <input 
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(question.id, option.id, 'text', e.target.value)}
                    placeholder={`Option ${option.id}`}
                    required
                    className={option.isCorrect ? 'correct-option' : ''}
                  />
                </div>
              ))}
              
              <div className="form-group">
                <label htmlFor={`explanation-${question.id}`}>Explication (optionnelle)</label>
                <textarea 
                  id={`explanation-${question.id}`}
                  value={question.explanation}
                  onChange={(e) => handleQuestionChange(question.id, 'explanation', e.target.value)}
                  placeholder="Explication de la réponse correcte"
                  rows="2"
                />
              </div>
              
              <hr className="mt-3 mb-3" />
            </div>
          ))}
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={addQuestion}
          >
            <PlusCircle size={16} />
            Ajouter une question
          </button>
        </div>
      )
    },
    {
      title: 'Révision',
      content: (
        <div className="review-container">
          <div className="card mb-3">
            <div className="card-header">
              <h3>Détails du Quiz</h3>
            </div>
            <div className="card-content">
              <p><strong>Titre:</strong> {quizData.title || 'Non défini'}</p>
              <p><strong>Description:</strong> {quizData.description || 'Non définie'}</p>
              <p><strong>Temps Limite:</strong> {quizData.timeLimit} minutes</p>
              <p><strong>Catégorie:</strong> {quizData.category || 'Non définie'}</p>
              <p><strong>Visibilité:</strong> {quizData.isPublic ? 'Public' : 'Privé'}</p>
              <p><strong>Nombre de questions:</strong> {quizData.questions.length}</p>
            </div>
          </div>
          
          <h3>Questions</h3>
          {quizData.questions.map((question, qIndex) => (
            <div key={question.id} className="accordion-item">
              <div className="accordion-header">
                <h4>Question {qIndex + 1}: {question.questionText || 'Non définie'}</h4>
              </div>
              <div className="accordion-content">
                <h5>Options:</h5>
                <ul>
                  {question.options.map((option) => (
                    <li key={option.id} className={option.isCorrect ? 'text-success' : ''}>
                      {option.text || `Option ${option.id}`} {option.isCorrect && '(Correcte)'}
                    </li>
                  ))}
                </ul>
                {question.explanation && (
                  <>
                    <h5>Explication:</h5>
                    <p>{question.explanation}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <Layout title="Créer un Quiz" userRole="professor">
      <div className="quiz-creation-container">
        <div className="header-section d-flex justify-between align-center mb-4">
          <div className="logo-container">
            <img src={logoImg} alt="QGen Logo" className="logo" style={{ height: '50px' }} />
          </div>
          <button 
            type="button" 
            className="btn btn-info"
            onClick={() => navigate('/professor/generate-quiz')}
          >
            Générer Quiz
          </button>
        </div>

        <div className="stepper">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className={`step ${activeStep >= index ? 'active' : ''}`}>
                <div className="step-number">{index + 1}</div>
                <div className="step-label">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-connector ${activeStep > index ? 'active' : ''}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="centered-form" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {steps[activeStep].content}
          
          <div className="form-actions d-flex justify-between mt-4">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
            >
              Précédent
            </button>
            
            {activeStep < steps.length - 1 ? (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
              >
                Suivant
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn btn-success"
              >
                <Save size={16} />
                Enregistrer le Quiz
              </button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default QuizCreation;