import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Save,
    PlusCircle,
    Trash2,
    ArrowLeft,
    AlertCircle
} from 'lucide-react';
import Layout from '../common/Layout';
import axios from 'axios'; // Assurez-vous d'avoir installé axios

const QuizEdit = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizData, setQuizData] = useState({
        id: null,
        titre: '',
        description: '',
        duree: 30,
        estPublic: true,
        correctionImmediate: false,
        questions: []
    });

    // Récupération des données du quiz
    useEffect(() => {
        const fetchQuizData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/quizzes/${quizId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                // Adapter le format de données du backend au format attendu par le frontend
                const quiz = response.data;
                setQuizData({
                    id: quiz.id,
                    titre: quiz.titre,
                    description: quiz.description,
                    duree: quiz.duree,
                    estPublic: quiz.estPublic,
                    correctionImmediate: quiz.correctionImmediate,
                    questions: quiz.questions.map(q => ({
                        id: q.id,
                        enonce: q.enonce,
                        type: q.type,
                        points: q.points,
                        options: q.options.map(opt => ({
                            id: opt.id,
                            valeurReponse: opt.valeurReponse,
                            estCorrecte: opt.estCorrecte,
                            feedback: opt.feedback || ''
                        }))
                    }))
                });
                setLoading(false);
            } catch (err) {
                console.error('Erreur lors du chargement du quiz:', err);
                setError('Erreur lors du chargement du quiz. Veuillez réessayer.');
                setLoading(false);
            }
        };

        if (quizId) {
            fetchQuizData();
        }
    }, [quizId]);

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
                            // Si c'est estCorrecte, on réinitialise d'abord tous à false
                            if (field === 'estCorrecte' && value === true) {
                                return opt.id === optionId ? { ...opt, estCorrecte: true } : { ...opt, estCorrecte: false };
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
        const newQuestionId = Math.max(...quizData.questions.map(q => q.id || 0), 0) + 1;
        setQuizData({
            ...quizData,
            questions: [
                ...quizData.questions,
                {
                    id: null, // Pas d'ID car c'est une nouvelle question
                    enonce: '',
                    type: 'QCM',
                    points: 1,
                    options: [
                        { id: null, valeurReponse: '', estCorrecte: false, feedback: '' },
                        { id: null, valeurReponse: '', estCorrecte: false, feedback: '' },
                        { id: null, valeurReponse: '', estCorrecte: false, feedback: '' },
                        { id: null, valeurReponse: '', estCorrecte: false, feedback: '' }
                    ]
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
            });
        }
    };

    // Préparer les données pour l'envoi au backend
    const prepareDataForBackend = () => {
        return {
            id: quizData.id,
            titre: quizData.titre,
            description: quizData.description,
            duree: quizData.duree,
            estPublic: quizData.estPublic,
            correctionImmediate: quizData.correctionImmediate,
            questions: quizData.questions.map(q => ({
                id: q.id,
                enonce: q.enonce,
                type: q.type || 'QCM',
                points: q.points || 1,
                options: q.options.map(opt => ({
                    id: opt.id,
                    valeurReponse: opt.valeurReponse,
                    estCorrecte: opt.estCorrecte,
                    feedback: opt.feedback || ''
                }))
            }))
        };
    };

    // Gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = prepareDataForBackend();
            console.log('Données à envoyer:', dataToSend);

            // Appel à l'API pour mettre à jour le quiz
            const response = await axios.put(`/api/quizzes/${quizId}`, dataToSend);

            setLoading(false);
            alert('Quiz mis à jour avec succès!');
            navigate('/professor/manage-quiz');
        } catch (err) {
            console.error('Erreur lors de la mise à jour du quiz:', err);
            setError('Erreur lors de la mise à jour. Veuillez réessayer.');
            setLoading(false);
        }
    };

    // Le reste de votre code pour le rendu des étapes
    const steps = [
        {
            title: 'Informations de base',
            content: (
                <div className="form-container">
                    <div className="form-group">
                        <label htmlFor="titre">Titre du Quiz</label>
                        <input
                            type="text"
                            id="titre"
                            name="titre"
                            value={quizData.titre}
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
                        <label htmlFor="duree">Temps Limite (minutes)</label>
                        <input
                            type="number"
                            id="duree"
                            name="duree"
                            value={quizData.duree}
                            onChange={handleQuizInfoChange}
                            min="1"
                            max="120"
                        />
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="estPublic"
                                checked={quizData.estPublic}
                                onChange={handleQuizInfoChange}
                            />
                            Quiz public (visible par tous les étudiants)
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="correctionImmediate"
                                checked={quizData.correctionImmediate}
                                onChange={handleQuizInfoChange}
                            />
                            Correction immédiate (les étudiants voient les réponses après chaque question)
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
                        <div key={question.id || `new-${qIndex}`} className="question-form">
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
                                <label htmlFor={`question-${question.id || qIndex}`}>Question</label>
                                <textarea
                                    id={`question-${question.id || qIndex}`}
                                    value={question.enonce || ''}
                                    onChange={(e) => handleQuestionChange(question.id, 'enonce', e.target.value)}
                                    placeholder="Entrez votre question"
                                    rows="2"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor={`points-${question.id || qIndex}`}>Points</label>
                                <input
                                    type="number"
                                    id={`points-${question.id || qIndex}`}
                                    value={question.points || 1}
                                    onChange={(e) => handleQuestionChange(question.id, 'points', parseInt(e.target.value))}
                                    min="1"
                                    max="10"
                                />
                            </div>

                            <h4>Options de réponse</h4>
                            {question.options.map((option, optIndex) => (
                                <div key={option.id || `new-opt-${optIndex}`} className="option-row">
                                    <input
                                        type="radio"
                                        id={`option${question.id || qIndex}-${option.id || optIndex}`}
                                        name={`correct-${question.id || qIndex}`}
                                        checked={option.estCorrecte}
                                        onChange={() => handleOptionChange(question.id, option.id || `new-opt-${optIndex}`, 'estCorrecte', true)}
                                    />
                                    <input
                                        type="text"
                                        value={option.valeurReponse || ''}
                                        onChange={(e) => handleOptionChange(question.id, option.id || `new-opt-${optIndex}`, 'valeurReponse', e.target.value)}
                                        placeholder={`Option ${optIndex + 1}`}
                                        required
                                        className={option.estCorrecte ? 'correct-option' : ''}
                                    />
                                    <input
                                        type="text"
                                        value={option.feedback || ''}
                                        onChange={(e) => handleOptionChange(question.id, option.id || `new-opt-${optIndex}`, 'feedback', e.target.value)}
                                        placeholder="Feedback (optionnel)"
                                    />
                                </div>
                            ))}

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
                            <p><strong>Titre:</strong> {quizData.titre || 'Non défini'}</p>
                            <p><strong>Description:</strong> {quizData.description || 'Non définie'}</p>
                            <p><strong>Temps Limite:</strong> {quizData.duree} minutes</p>
                            <p><strong>Visibilité:</strong> {quizData.estPublic ? 'Public' : 'Privé'}</p>
                            <p><strong>Correction immédiate:</strong> {quizData.correctionImmediate ? 'Oui' : 'Non'}</p>
                            <p><strong>Nombre de questions:</strong> {quizData.questions.length}</p>
                        </div>
                    </div>

                    <h3>Questions</h3>
                    {quizData.questions.map((question, qIndex) => (
                        <div key={question.id || `review-${qIndex}`} className="accordion-item">
                            <div className="accordion-header">
                                <h4>Question {qIndex + 1}: {question.enonce || 'Non définie'}</h4>
                            </div>
                            <div className="accordion-content">
                                <p><strong>Points:</strong> {question.points || 1}</p>
                                <h5>Options:</h5>
                                <ul>
                                    {question.options.map((option, optIndex) => (
                                        <li key={option.id || `review-opt-${optIndex}`} className={option.estCorrecte ? 'text-success' : ''}>
                                            {option.valeurReponse || `Option ${optIndex + 1}`} {option.estCorrecte && '(Correcte)'}
                                            {option.feedback && <p className="option-feedback"><em>Feedback: {option.feedback}</em></p>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <Layout title="Modification du Quiz" userRole="professor">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement du quiz...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout title="Erreur" userRole="professor">
                <div className="error-container">
                    <AlertCircle size={48} className="text-danger mb-3" />
                    <h2>Une erreur est survenue</h2>
                    <p>{error}</p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => navigate('/professor/manage-quiz')}
                    >
                        Retour à la liste des quiz
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={`Modifier: ${quizData.titre}`} userRole="professor">
            <div className="quiz-edit-container">
                <div className="header-section d-flex justify-between align-center mb-4">
                    <button
                        className="btn btn-text"
                        onClick={() => navigate('/professor/manage-quiz')}
                    >
                        <ArrowLeft size={16} />
                        Retour à la liste
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
                                disabled={loading}
                            >
                                <Save size={16} />
                                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default QuizEdit;