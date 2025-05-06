import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import './UserManagement.css';

const UserManagement = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ 
    nom: '', 
    prenom: '', 
    email: '', 
    motDePasse: '' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [authStatus, setAuthStatus] = useState({
    token: null,
    isValid: false,
    message: "Vérification du token..."
  });

  // Vérifier l'état d'authentification
  useEffect(() => {
    checkAuth();
  }, []);

  // Fonction pour vérifier l'état d'authentification
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    console.log("Token trouvé:", token ? "Oui" : "Non");
    
    if (!token) {
      setAuthStatus({
        token: null,
        isValid: false,
        message: "Aucun token trouvé. Veuillez vous connecter."
      });
      return null;
    }
    
    // Pour tester si le token est au format attendu
    if (!token.startsWith("ey")) {
      console.warn("Le token ne semble pas être au format JWT (ne commence pas par 'ey')");
    }
    
    setAuthStatus({
      token: token,
      isValid: true,
      message: "Token trouvé"
    });
    
    return token;
  };

  // Charger les étudiants depuis l'API
  useEffect(() => {
    if (authStatus.isValid) {
      fetchStudents();
    }
  }, [authStatus.isValid]);

  // Fonction pour récupérer tous les étudiants
  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    
    // Vérifier à nouveau l'authentification
    const token = checkAuth();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("Tentative d'appel API avec token:", `Bearer ${token.substring(0, 15)}...`);

      // Définir les headers manuellement pour cette requête
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Essayez d'appeler directement l'API sans intercepteur
      const response = await axios.get('http://localhost:8080/api/etudiants', config);
      
      console.log("Réponse API:", response.status);
      setStudents(response.data);
      setSuccessMessage("Données étudiants chargées avec succès");
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error("Erreur détaillée:", err);
      
      if (err.response) {
        // Si nous recevons une réponse avec une erreur
        const statusCode = err.response.status;
        const responseBody = err.response.data;
        
        console.log({
          status: statusCode,
          data: responseBody,
          headers: err.response.headers
        });
        
        if (statusCode === 403) {
          setError(`Accès refusé (403). Il semble que vous n'ayez pas les permissions nécessaires.`);
        } else if (statusCode === 401) {
          setError(`Authentification invalide (401). Votre session a peut-être expiré.`);
          // Réinitialiser le token
          localStorage.removeItem('token');
          setAuthStatus({
            token: null, 
            isValid: false,
            message: "Token invalide ou expiré. Reconnexion nécessaire."
          });
        } else {
          setError(`Erreur: ${statusCode} ${err.response.statusText}`);
        }
      } else if (err.request) {
        // La requête a été envoyée mais pas de réponse
        setError("Erreur de connexion: Impossible de joindre le serveur.");
      } else {
        // Erreur lors de la création de la requête
        setError(`Erreur lors de la requête: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un étudiant
  const handleDeleteStudent = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      try {
        const token = checkAuth();
        if (!token) return;
        
        await axios.delete(`http://localhost:8080/api/etudiants/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setStudents(students.filter(student => student.id !== id));
        setSuccessMessage('Étudiant supprimé avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        handleApiError(err, "Erreur lors de la suppression");
      }
    }
  };

  // Gérer les erreurs API
  const handleApiError = (err, context) => {
    console.error(`${context}:`, err);
    
    if (err.response) {
      const statusCode = err.response.status;
      
      if (statusCode === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        localStorage.removeItem('token');
        setAuthStatus({
          token: null, 
          isValid: false,
          message: "Session expirée"
        });
      } else {
        setError(`${context}: ${statusCode} ${err.response.statusText}`);
      }
    } else if (err.request) {
      setError("Erreur de connexion au serveur");
    } else {
      setError(`${context}: ${err.message}`);
    }
  };

  // Ouvrir la modal pour modifier un étudiant
  const handleEditStudent = (id) => {
    const studentToEdit = students.find(student => student.id === id);
    if (studentToEdit) {
      setNewStudent({
        id: studentToEdit.id,
        nom: studentToEdit.nom || '',
        prenom: studentToEdit.prenom || '',
        email: studentToEdit.email || '',
        motDePasse: '' // Ne pas pré-remplir le mot de passe pour des raisons de sécurité
      });
      setIsModalOpen(true);
    }
  };

  // Créer ou mettre à jour un étudiant
  const handleSaveStudent = async () => {
    // Validation simple
    if (!newStudent.nom || !newStudent.prenom || !newStudent.email) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = checkAuth();
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      let response;
      
      if (newStudent.id) {
        // Mise à jour d'un étudiant existant
        response = await axios.put(
          `http://localhost:8080/api/etudiants/${newStudent.id}`, 
          newStudent,
          config
        );
      } else {
        // Création d'un nouvel étudiant
        response = await axios.post(
          'http://localhost:8080/api/admins/create-user', 
          {
            ...newStudent,
            role: 'student'
          },
          config
        );
      }
      
      const data = response.data;
      
      // Mettre à jour la liste des étudiants
      if (newStudent.id) {
        setStudents(students.map(student => 
          student.id === newStudent.id ? data.utilisateur || data : student
        ));
      } else {
        // Si on crée un nouvel étudiant, rafraîchir la liste complète
        fetchStudents();
      }
      
      // Réinitialiser le formulaire et fermer la modal
      setNewStudent({ nom: '', prenom: '', email: '', motDePasse: '' });
      setIsModalOpen(false);
      setSuccessMessage(data.message || 'Étudiant enregistré avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      handleApiError(err, "Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les étudiants par nom ou prénom
  const filteredStudents = students.filter(student => {
    const fullName = `${student.nom || ''} ${student.prenom || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Gérer la fermeture de la modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewStudent({ nom: '', prenom: '', email: '', motDePasse: '' });
    setError(null);
  };

  // Se connecter (redirection)
  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <Layout title="Gestion des Étudiants" userRole="admin">
      <div className="user-management-container">
        <h2>Gestion des Étudiants</h2>
        
        {/* État d'authentification */}
        <div className="auth-status" style={{ marginBottom: '20px', padding: '15px', background: authStatus.isValid ? '#e8f5e9' : '#ffebee', borderRadius: '5px' }}>
          <h3>État de l'authentification</h3>
          <p>{authStatus.message}</p>
          
          {!authStatus.isValid && (
            <button 
              onClick={handleLogin}
              style={{ padding: '8px 16px', marginTop: '10px' }}
            >
              Se connecter
            </button>
          )}
          
          {authStatus.isValid && (
            <button 
              onClick={fetchStudents}
              style={{ padding: '8px 16px', marginTop: '10px', marginRight: '10px' }}
            >
              Rafraîchir les données
            </button>
          )}
        </div>
        
        {/* Message de succès */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {/* Message d'erreur */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {/* Actions et recherche */}
        <div className="actions-bar">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="btn-primary" 
            onClick={() => setIsModalOpen(true)}
            disabled={!authStatus.isValid}
          >
            Ajouter un étudiant
          </button>
        </div>
        
        {/* État de chargement */}
        {isLoading && <div className="loading">Chargement en cours...</div>}
        
        {/* Tableau des étudiants */}
        {!isLoading && authStatus.isValid && (
          <table className="student-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>{student.nom || 'N/A'}</td>
                    <td>{student.prenom || 'N/A'}</td>
                    <td>{student.email || 'N/A'}</td>
                    <td className="actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditStudent(student.id)}
                      >
                        Modifier
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    Aucun étudiant trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        
        {/* Modal pour créer/modifier un étudiant */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{newStudent.id ? 'Modifier l\'étudiant' : 'Ajouter un étudiant'}</h3>
                <button className="btn-close" onClick={handleCloseModal}>×</button>
              </div>
              
              <div className="modal-body">
                {error && <div className="modal-error">{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="nom">Nom*</label>
                  <input
                    id="nom"
                    type="text"
                    placeholder="Nom"
                    value={newStudent.nom}
                    onChange={(e) => setNewStudent({ ...newStudent, nom: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="prenom">Prénom*</label>
                  <input
                    id="prenom"
                    type="text"
                    placeholder="Prénom"
                    value={newStudent.prenom}
                    onChange={(e) => setNewStudent({ ...newStudent, prenom: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">
                    {newStudent.id ? 'Nouveau mot de passe (laisser vide si inchangé)' : 'Mot de passe*'}
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Mot de passe"
                    value={newStudent.motDePasse}
                    onChange={(e) => setNewStudent({ ...newStudent, motDePasse: e.target.value })}
                    required={!newStudent.id}
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="btn-cancel" onClick={handleCloseModal}>Annuler</button>
                <button 
                  className="btn-save" 
                  onClick={handleSaveStudent}
                  disabled={isLoading}
                >
                  {isLoading ? 'Enregistrement...' : (newStudent.id ? 'Mettre à jour' : 'Créer')}
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </Layout>
  );
};

export default UserManagement;