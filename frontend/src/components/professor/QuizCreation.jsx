import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Save, PlusCircle, Trash2} from 'lucide-react';
import Layout from '../common/Layout';
import logoImg from '../../utils/images/logo.png';
import axios from 'axios';

const QuizCreation = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [activeStep, setActiveStep] = useState(0);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        timeLimit: 30,
        questions: [
            {
                id: 1,
                questionText: '',
                type: 'QCU',
                points: 1,
                options: [
                    {id: 1, text: '', isCorrect: false, feedback: ''},
                    {id: 2, text: '', isCorrect: false, feedback: ''},
                    {id: 3, text: '', isCorrect: false, feedback: ''},
                    {id: 4, text: '', isCorrect: false, feedback: ''}
                ]
            }
        ]
    });

    const isStepValid = () => {
        if (activeStep === 0) {
            return quizData.title && quizData.description && quizData.timeLimit;
        }
        if (activeStep === 1) {
            return quizData.questions.every(question =>
                question.questionText &&
                question.points &&
                question.options.some(opt => opt.text) &&
                question.options.some(opt => opt.isCorrect)
            );
        }
        return true;
    };

    const handleQuizInfoChange = (e) => {
        const {name, value} = e.target;
        setQuizData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuestionChange = (questionId, field, value) => {
        setQuizData(prev => ({
            ...prev,
            questions: prev.questions.map(q =>
                q.id === questionId ? {...q, [field]: value} : q
            )
        }));
    };

    const handleOptionChange = (questionId, optionId, field, value) => {
        setQuizData(prev => ({
            ...prev,
            questions: prev.questions.map(q => {
                if (q.id === questionId) {
                    return {
                        ...q,
                        options: q.options.map(opt => {
                            if (field === 'isCorrect') {
                                return opt.id === optionId ? {...opt, isCorrect: true} : {...opt, isCorrect: false};
                            }
                            return opt.id === optionId ? {...opt, [field]: value} : opt;
                        })
                    };
                }
                return q;
            })
        }));
    };

    const handlePopupClose = () => {
        setShowSuccessPopup(false);
        navigate('/professor/manage-quiz');
    };

    const handleSubmit = async () => {
        const quiz = {
            titre: quizData.title,
            description: quizData.description,
            duree: quizData.timeLimit,
            questions: quizData.questions.map(q => ({
                enonce: q.questionText,
                points: q.points,
                type: q.type,
                reponses: q.options.filter(opt => opt.text).map(opt => ({
                    valeurReponse: opt.text,
                    estCorrecte: opt.isCorrect,
                    feedBack: opt.feedback
                }))
            }))
        };

        try {
            const response = await axios.post('http://localhost:8080/api/quizzes', {quiz}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Quiz created:', response.data);
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                navigate('/professor/manage-quiz');
            }, 10000);
        } catch (error) {
            console.error('Error creating quiz:', error);
        }
    };

    const addQuestion = () => {
        const newQuestionId = quizData.questions.length + 1;
        setQuizData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    id: newQuestionId,
                    questionText: '',
                    type: 'QCU',
                    points: 1,
                    options: [
                        {id: 1, text: '', isCorrect: false, feedback: ''},
                        {id: 2, text: '', isCorrect: false, feedback: ''},
                        {id: 3, text: '', isCorrect: false, feedback: ''},
                        {id: 4, text: '', isCorrect: false, feedback: ''}
                    ]
                }
            ]
        }));
    };

    const removeQuestion = (questionId) => {
        if (quizData.questions.length > 1) {
            setQuizData(prev => ({
                ...prev,
                questions: prev.questions
                    .filter(q => q.id !== questionId)
                    .map((q, idx) => ({...q, id: idx + 1}))
            }));
        }
    };

    const steps = [
        {
            title: 'Informations de base',
            content: (
                <div className="form-container">
                    <div className="form-group">
                        <label htmlFor="title">Titre du Quiz*</label>
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
                        <label htmlFor="description">Description*</label>
                        <textarea
                            id="description"
                            name="description"
                            value={quizData.description}
                            onChange={handleQuizInfoChange}
                            placeholder="Décrivez brièvement ce quiz"
                            rows="3"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="timeLimit">Temps Limite (minutes)*</label>
                        <input
                            type="number"
                            id="timeLimit"
                            name="timeLimit"
                            value={quizData.timeLimit}
                            onChange={handleQuizInfoChange}
                            min="1"
                            max="120"
                            required
                        />
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
                            <div className="question-header">
                                <h3>Question {qIndex + 1}</h3>
                                <button
                                    type="button"
                                    className="btn btn-danger "
                                    onClick={() => removeQuestion(question.id)}
                                    disabled={quizData.questions.length === 1}
                                >
                                    <Trash2 size={16}/>
                                    Supprimer
                                </button>
                            </div>

                            <div className="question-content">
                                <div className="form-group">
                                    <label>Question*</label>
                                    <textarea
                                        value={question.questionText}
                                        onChange={(e) => handleQuestionChange(question.id, 'questionText', e.target.value)}
                                        placeholder="Entrez votre question"
                                        rows="2"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Points*</label>
                                    <input
                                        type="number"
                                        value={question.points}
                                        onChange={(e) => handleQuestionChange(question.id, 'points', parseInt(e.target.value))}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="options-container">
                                    <h4>Options de réponse</h4>
                                    {question.options.map((option) => (
                                        <div key={option.id} className="option-row">
                                            <input
                                                type="radio"
                                                checked={option.isCorrect}
                                                onChange={() => handleOptionChange(question.id, option.id, 'isCorrect', true)}
                                            />
                                            <input
                                                type="text"
                                                value={option.text}
                                                onChange={(e) => handleOptionChange(question.id, option.id, 'text', e.target.value)}
                                                placeholder={`Option ${option.id}`}
                                                className={option.isCorrect ? 'correct-option' : ''}
                                            />
                                            <input
                                                type="text"
                                                value={option.feedback}
                                                onChange={(e) => handleOptionChange(question.id, option.id, 'feedback', e.target.value)}
                                                placeholder="Feedback pour cette option"
                                                className="feedback-input"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={addQuestion}
                    >
                        <PlusCircle size={16}/>
                        Ajouter une question
                    </button>
                </div>
            )
        },
        {
            title: 'Révision',
            content: (
                <div className="review-container">
                    <div className="review-section">
                        <h3>Informations de base</h3>
                        <div className="info-box">
                            <p><strong>Titre:</strong> {quizData.title}</p>
                            <p><strong>Description:</strong> {quizData.description}</p>
                            <p><strong>Durée:</strong> {quizData.timeLimit} minutes</p>
                        </div>
                    </div>

                    <div className="review-section">
                        <h3>Questions ({quizData.questions.length})</h3>
                        {quizData.questions.map((question, index) => (
                            <div key={question.id} className="question-review-box">
                                <div className="question-header">
                                    <h4>Question {index + 1}</h4>
                                    <span className="question-type">
                                        Question à choix unique
                                    </span>
                                    <span className="points-badge">
                                        {question.points} point{question.points > 1 ? 's' : ''}
                                    </span>
                                </div>

                                <p className="question-text">
                                    <strong>Énoncé:</strong> {question.questionText}
                                </p>

                                <div className="options-list">
                                    <p><strong>Options de réponse:</strong></p>
                                    {question.options.filter(opt => opt.text).map((option, optIndex) => (
                                        <div key={option.id}
                                             className={`option-review ${option.isCorrect ? 'correct-option' : ''}`}>
                                            <div className="option-header">
                                                <span className="option-number">{optIndex + 1}.</span>
                                                <span className="option-text">{option.text}</span>
                                                {option.isCorrect && <span className="correct-badge">Correcte</span>}
                                            </div>
                                            {option.feedback && (
                                                <div className="feedback-text">
                                                    <strong>Feedback:</strong> {option.feedback}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="review-section final-confirmation">
                        <p>Veuillez vérifier toutes les informations ci-dessus avant de sauvegarder le quiz.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <Layout title="Créer un Quiz" userRole="professor">
            <div className="quiz-creation-container">
                <div className="header-section">
                    <div className="logo-container">
                        <img src={logoImg} alt="QGen Logo" className="logo" style={{height: '50px'}}/>
                    </div>
                    <div className="btn-container"><Link to="/professor/generate-quiz"
                                                         className="btn btn-primary btn-2 mb-2">Générer avec QGen
                        Ai</Link></div>
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

                <div className="form-container">
                    {steps[activeStep].content}

                    <div className="form-actions">
                        {activeStep > 0 && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setActiveStep(activeStep - 1)}
                            >
                                Précédent
                            </button>
                        )}

                        {activeStep < steps.length - 1 ? (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setActiveStep(activeStep + 1)}
                                disabled={!isStepValid()}
                            >
                                Suivant
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleSubmit}
                                disabled={!isStepValid()}
                            >
                                <Save size={16}/>
                                Enregistrer le Quiz
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Succès!</h3>
                        <p>Le quiz a été généré avec succès.</p>
                        <button className="btn btn-primary" onClick={handlePopupClose}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default QuizCreation;