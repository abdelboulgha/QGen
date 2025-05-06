import React, { useState } from 'react';
import { 
  X, 
  FileUp, 
  Share2, 
  Book, 
  Send,
  Loader,
  ChevronRight
} from 'lucide-react';
import Layout from '../common/Layout';
import './QuizGenerator.css'; // Import du fichier CSS

// Composant fleur SVG pour remplacer le logo
const FlowerLogo = () => (
  <svg width="80" height="80" viewBox="0 0 120 120">
    <g transform="translate(60, 60)">
      {/* Pétales en dégradé de turquoise */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const color = i % 2 === 0 ? '#4DD8C7' : '#25A6A4';
        const lightColor = i % 2 === 0 ? '#7DEAE0' : '#4DD8C7';
        return (
          <g key={i} transform={`rotate(${angle * (180/Math.PI)})`}>
            <path 
              d="M0,0 Q10,15 0,30 Q-10,15 0,0" 
              fill={lightColor} 
              transform="translate(0, -15)"
            />
            <path 
              d="M0,0 Q10,15 0,30 Q-10,15 0,0" 
              fill={color} 
              transform="translate(0, -5)"
            />
          </g>
        );
      })}
      {/* Centre de la fleur */}
      <circle cx="0" cy="0" r="8" fill="#108587" />
    </g>
  </svg>
);

const QuizGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const generateQuiz = () => {
    if (!inputText.trim()) {
      alert('Veuillez fournir du contenu pour générer un quiz.');
      return;
    }

    setIsGenerating(true);
    
    // Simulation d'une requête API pour générer le quiz
    setTimeout(() => {
      // Exemple de quiz généré
      const mockGeneratedQuiz = {
        title: "Quiz généré automatiquement",
        description: "Ce quiz a été créé à partir de votre contenu.",
        questions: [
          {
            id: 1,
            questionText: "Quelle est la première question générée?",
            options: [
              { id: 1, text: "Option 1", isCorrect: true },
              { id: 2, text: "Option 2", isCorrect: false },
              { id: 3, text: "Option 3", isCorrect: false },
              { id: 4, text: "Option 4", isCorrect: false }
            ],
            explanation: "Explication de la réponse correcte."
          },
          {
            id: 2,
            questionText: "Voici une deuxième question générée.",
            options: [
              { id: 1, text: "Première option", isCorrect: false },
              { id: 2, text: "Deuxième option", isCorrect: true },
              { id: 3, text: "Troisième option", isCorrect: false },
              { id: 4, text: "Quatrième option", isCorrect: false }
            ],
            explanation: "Explication pour la deuxième question."
          }
        ]
      };
      
      setGeneratedQuiz(mockGeneratedQuiz);
      setIsGenerating(false);
      closeModal();
    }, 2000);
  };

  const saveGeneratedQuiz = () => {
    // Ici, vous pourriez implémenter la logique pour sauvegarder le quiz
    alert('Quiz sauvegardé avec succès!');
    // Redirection vers la page de gestion des quiz
    // navigate('/professor/manage-quiz');
  };

  const editQuiz = () => {
    // Redirection vers la page de création de quiz avec les données pré-remplies
    // navigate('/professor/create-quiz', { state: { quizData: generatedQuiz } });
    alert('Redirection vers l\'éditeur de quiz');
  };

  return (
    <Layout title="QGen" userRole="professor">
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <div className="mb-6 mt-8">
          <FlowerLogo />
        </div>

        <h1 className="text-4xl font-bold text-gray-700 mb-2">Bienvenue sur QGen</h1>
        <p className="text-gray-600 mb-8">Prêt à tester vos connaissances ?</p>

        {!generatedQuiz ? (
          <div className="w-full max-w-lg">
            <div className="flex items-center bg-gray-50 rounded-full shadow-md overflow-hidden pl-4 pr-2 py-2 border border-gray-100">
              <div className="mr-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Indiquez un sujet, et laissez la magie opérer!"
                className="flex-grow bg-transparent outline-none text-gray-700"
                onClick={openModal}
              />
              <button className="ml-2 p-2 rounded-full text-teal-500" onClick={openModal}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg mt-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700">{generatedQuiz.title}</h3>
                <div className="flex space-x-2">
                  <button 
                    className="px-3 py-1 rounded-full text-teal-600 border border-teal-600 text-sm hover:bg-teal-50"
                    onClick={editQuiz}
                  >
                    Modifier
                  </button>
                  <button 
                    className="px-3 py-1 rounded-full bg-teal-500 text-white text-sm hover:bg-teal-600"
                    onClick={saveGeneratedQuiz}
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4">{generatedQuiz.description}</p>
                
                <h4 className="font-medium mb-2 text-gray-700">Aperçu des questions:</h4>
                <div className="space-y-3">
                  {generatedQuiz.questions.map((question, index) => (
                    <div key={question.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700">Question {index + 1}: {question.questionText}</p>
                      <ul className="mt-2 space-y-1">
                        {question.options.map(option => (
                          <li 
                            key={option.id} 
                            className={`${option.isCorrect ? 'text-teal-600 font-medium' : 'text-gray-600'} ml-4`}
                          >
                            {option.text} {option.isCorrect && '(Correcte)'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal pour la génération de quiz */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-700">Générer un Quiz</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <label htmlFor="contentInput" className="block mb-2 text-gray-700">Contenu source</label>
                  <textarea 
                    id="contentInput"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:border-transparent"
                    rows="6"
                    placeholder="Collez votre texte ici ou importez un fichier..."
                    value={inputText}
                    onChange={handleTextChange}
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="fileUpload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                    <FileUp size={18} className="mr-2" />
                    Importer un fichier
                  </label>
                  <input 
                    type="file" 
                    id="fileUpload" 
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".txt,.pdf,.doc,.docx"
                  />
                  {uploadedFile && (
                    <span className="ml-2 text-gray-600">
                      {uploadedFile.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-end p-4 bg-gray-50 rounded-b-lg">
                <button 
                  className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 mr-2"
                  onClick={closeModal}
                >
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600 flex items-center"
                  onClick={generateQuiz}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader size={16} className="animate-spin mr-2" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Générer le Quiz
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QuizGenerator;