import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    X,
    FileUp,
    Share2,
    Book,
    Send,
    Loader,
    CheckCircle,
    ChevronRight
} from 'lucide-react';
import './QuizGenerator.css';
import Layout from '../common/Layout';
import logoImg from "../../utils/images/logo.png";

const FlowerLogo = () => (
    <img src={logoImg} alt="QGen Logo" className="logo" style={{height: '50px'}}/>
);

const LoadingModal = ({message}) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-white rounded-lg p-6 shadow-xl w-80 text-center">
            <div className="flex justify-center mb-4">
                <Loader size={40} className="animate-spin text-teal-500"/>
            </div>
            <p className="text-gray-700">{message}</p>
        </div>
    </div>
);

const SuccessModal = ({onClose, redirectCountdown}) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-white rounded-lg p-6 shadow-xl w-96 text-center">
            <div className="flex justify-center mb-4">
                <CheckCircle size={60} className="text-green-500"/>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Quiz généré avec succès!</h3>
            <p className="text-gray-600 mb-6">Votre quiz a été créé et sera disponible dans la section de gestion des quiz.</p>
            <p className="text-sm text-gray-500 mb-4">Redirection dans {redirectCountdown} secondes...</p>
            <div>
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-all duration-200 shadow-md"
                >
                    OK
                </button>
            </div>
        </div>
    </div>
);

const QuizGenerator = () => {
    const [inputText, setInputText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedQuiz, setGeneratedQuiz] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [inputMethod, setInputMethod] = useState(null); // 'text' or 'file'
    const [error, setError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(10);

    const API_BASE_URL = 'http://localhost:8080';
    const token = localStorage.getItem('token');

    useEffect(() => {
        let countdownTimer;

        if (showSuccessModal) {
            countdownTimer = setInterval(() => {
                setRedirectCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownTimer);
                        window.location.href = "/professor/manage-quiz";
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (countdownTimer) clearInterval(countdownTimer);
        };
    }, [showSuccessModal]);

    const handleTextChange = (e) => {
        setInputText(e.target.value);
        if (e.target.value) {
            setInputMethod('text');
            setUploadedFile(null);
        } else {
            setInputMethod(null);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file);
            setInputMethod('file');
            setInputText(''); // Clear text input when file is uploaded
        }
    };

    const clearInput = () => {
        setInputText('');
        setUploadedFile(null);
        setInputMethod(null);
        setError(null);
    };

    const generateQuiz = async () => {
        if ((!inputText.trim() && inputMethod === 'text') || (!uploadedFile && inputMethod === 'file')) {
            setError('Veuillez fournir du contenu pour générer un quiz.');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            let response;

            if (inputMethod === 'text') {
                // Send text request
                response = await axios.post(`${API_BASE_URL}/api/generation/quiz/text`, null, {
                    params: {
                        text: inputText
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
            } else if (inputMethod === 'file') {
                // Send file request
                const formData = new FormData();
                formData.append('file', uploadedFile);

                response = await axios.post(`${API_BASE_URL}/api/generation/quiz/pdf`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });
            }

            if (response.data && response.data.success) {
                setGeneratedQuiz(response.data.quiz);
                // Show success modal instead of displaying quiz details
                setShowSuccessModal(true);
            } else {
                setError(response.data.message || 'Une erreur est survenue lors de la génération du quiz.');
            }
        } catch (error) {
            console.error('Error generating quiz:', error);
            setError('Une erreur est survenue lors de la communication avec le serveur.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        window.location.href = "/professor/manage-quiz";
    };

    return (
        <Layout title="QGen" userRole="professor">
            <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
                <div className="mb-6 mt-8">
                    <FlowerLogo/>
                </div>

                <h1 className="text-4xl font-bold text-gray-700 mb-2">Bienvenue sur QGen</h1>
                <p className="text-gray-600 mb-8">Prêt à tester vos connaissances ?</p>

                {isGenerating && (
                    <LoadingModal message="Génération de votre quiz en cours..."/>
                )}

                {showSuccessModal && (
                    <SuccessModal
                        onClose={handleModalClose}
                        redirectCountdown={redirectCountdown}
                    />
                )}

                <div className="w-full max-w-lg">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 animate-fadeIn">
                                {error}
                            </div>
                        )}
                        <div className="mb-4 relative">
                            <textarea
                                className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:border-transparent ${
                                    inputMethod === 'file' ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                                }`}
                                rows="6"
                                placeholder="Écrivez ou collez votre texte ici..."
                                value={inputText}
                                onChange={handleTextChange}
                                disabled={inputMethod === 'file'}
                            ></textarea>
                            {inputText && (
                                <button
                                    onClick={clearInput}
                                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                                >
                                    <X size={16} className="text-gray-500"/>
                                </button>
                            )}
                        </div>

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex-1">
                                <label
                                    htmlFor="fileUpload"
                                    className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md w-full justify-center ${
                                        inputMethod === 'text'
                                            ? 'bg-gray-100 cursor-not-allowed text-gray-500'
                                            : 'bg-white hover:bg-gray-50 cursor-pointer text-gray-700'
                                    }`}
                                >
                                    <FileUp size={18} className="mr-2"/>
                                    Importer un fichier
                                </label>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept=".txt,.pdf,.doc,.docx"
                                    disabled={inputMethod === 'text'}
                                />
                            </div>
                            {uploadedFile && (
                                <span className="text-sm text-gray-600 flex-1 truncate">
                                    {uploadedFile.name}
                                </span>
                            )}
                        </div>

                        <button
                            className={`w-full px-4 py-3 rounded-md flex items-center justify-center transition-all duration-200 shadow-md ${
                                (!inputText.trim() && inputMethod === 'text') || (!uploadedFile && inputMethod === 'file') || !inputMethod
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-teal-500 text-white hover:bg-teal-600 transform hover:-translate-y-1'
                            }`}
                            onClick={generateQuiz}
                            disabled={(!inputText.trim() && inputMethod === 'text') || (!uploadedFile && inputMethod === 'file') || !inputMethod}
                        >
                            <Send size={16} className="mr-2"/>
                            Générer le Quiz
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default QuizGenerator;