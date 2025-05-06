import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../common/Layout';
import './UserManagement.css';

const ProfesseurManagement = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [newProfesseur, setNewProfesseur] = useState({ 
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

  // Charger les professeurs depuis l'API
  useEffect(() => {
    if (authStatus.isValid) {
      fetchProfesseurs();
    }
  }, [authStatus.isValid]);

  // Fonction pour récupérer tous les professeurs
  const fetchProfesseurs = async () => {
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

      // Essayez d'appeler directement l'API
      const response = await axios.get('http://localhost:8080/api/professeurs', config);
      
      console.log("Réponse API:", response.status);
      setProfesseurs(response.data);
      setSuccessMessage("Données professeurs chargées avec succès");
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

  // Supprimer un professeur
  const handleDeleteProfesseur = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) {
      try {
        const token = checkAuth();
        if (!token) return;
        
        await axios.delete(`http://localhost:8080/api/professeurs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setProfesseurs(professeurs.filter(professeur => professeur.id !== id));
        setSuccessMessage('Professeur supprimé avec succès');
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

  // Ouvrir la modal pour modifier un professeur
  const handleEditProfesseur = (id) => {
    const professeurToEdit = professeurs.find(professeur => professeur.id === id);
    if (professeurToEdit) {
      setNewProfesseur({
        id: professeurToEdit.id,
        nom: professeurToEdit.nom || '',
        prenom: professeurToEdit.prenom || '',
        email: professeurToEdit.email || '',
        motDePasse: '' // Ne pas pré-remplir le mot de passe pour des raisons de sécurité
      });
      setIsModalOpen(true);
    }
  };

  // Créer ou mettre à jour un professeur
  const handleSaveProfesseur = async () => {
    // Validation simple
    if (!newProfesseur.nom || !newProfesseur.prenom || !newProfesseur.email) {
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
      
      if (newProfesseur.id) {
        // Mise à jour d'un professeur existant
        const professeurToUpdate = {
          nom: newProfesseur.nom,
          prenom: newProfesseur.prenom,
          email: newProfesseur.email
        };
        
        // N'ajouter le mot de passe que s'il est fourni
        if (newProfesseur.motDePasse) {
          professeurToUpdate.motDePasse = newProfesseur.motDePasse;
        }
        
        console.log("Mise à jour professeur:", professeurToUpdate);
        
        response = await axios.put(
          `http://localhost:8080/api/professeurs/${newProfesseur.id}`, 
          professeurToUpdate,
          config
        );
        
        console.log("Réponse mise à jour:", response.data);
        
        // Mettre à jour la liste des professeurs
        setProfesseurs(professeurs.map(professeur => 
          professeur.id === newProfesseur.id ? {
            ...professeur,
            nom: newProfesseur.nom,
            prenom: newProfesseur.prenom,
            email: newProfesseur.email
          } : professeur
        ));
      } else {
        // Création d'un nouveau professeur
        response = await axios.post(
          'http://localhost:8080/api/admins/create-user', 
          {
            ...newProfesseur,
            role: 'PROFESSOR'
          },
          config
        );
        
        // Si on crée un nouveau professeur, rafraîchir la liste complète
        fetchProfesseurs();
      }
      
      // Réinitialiser le formulaire et fermer la modal
      setNewProfesseur({ nom: '', prenom: '', email: '', motDePasse: '' });
      setIsModalOpen(false);
      setSuccessMessage(newProfesseur.id ? 'Professeur modifié avec succès' : 'Professeur créé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      handleApiError(err, "Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les professeurs par nom ou prénom
  const filteredProfesseurs = professeurs.filter(professeur => {
    const fullName = `${professeur.nom || ''} ${professeur.prenom || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           (professeur.email && professeur.email.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Gérer la fermeture de la modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewProfesseur({ nom: '', prenom: '', email: '', motDePasse: '' });
    setError(null);
  };

  // Se connecter (redirection)
  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <Layout title="Gestion des Professeurs" userRole="admin">
      <div className="user-management-container">
        <h2>Gestion des Professeurs</h2>
        
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
            Ajouter un professeur
          </button>
        </div>
        
        {/* État de chargement */}
        {isLoading && <div className="loading">Chargement en cours...</div>}
        
        {/* Tableau des professeurs */}
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
              {filteredProfesseurs.length > 0 ? (
                filteredProfesseurs.map(professeur => (
                  <tr key={professeur.id}>
                    <td>{professeur.nom || 'N/A'}</td>
                    <td>{professeur.prenom || 'N/A'}</td>
                    <td>{professeur.email || 'N/A'}</td>
                    <td className="actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditProfesseur(professeur.id)}
                      >
                        Modifier
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteProfesseur(professeur.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    Aucun professeur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        
        {/* Modal pour créer/modifier un professeur */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{newProfesseur.id ? 'Modifier le professeur' : 'Ajouter un professeur'}</h3>
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
                    value={newProfesseur.nom}
                    onChange={(e) => setNewProfesseur({ ...newProfesseur, nom: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="prenom">Prénom*</label>
                  <input
                    id="prenom"
                    type="text"
                    placeholder="Prénom"
                    value={newProfesseur.prenom}
                    onChange={(e) => setNewProfesseur({ ...newProfesseur, prenom: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={newProfesseur.email}
                    onChange={(e) => setNewProfesseur({ ...newProfesseur, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">
                    {newProfesseur.id ? 'Nouveau mot de passe (laisser vide si inchangé)' : 'Mot de passe*'}
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Mot de passe"
                    value={newProfesseur.motDePasse}
                    onChange={(e) => setNewProfesseur({ ...newProfesseur, motDePasse: e.target.value })}
                    required={!newProfesseur.id}
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="btn-cancel" onClick={handleCloseModal}>Annuler</button>
                <button 
                  className="btn-save" 
                  onClick={handleSaveProfesseur}
                  disabled={isLoading}
                >
                  {isLoading ? 'Enregistrement...' : (newProfesseur.id ? 'Mettre à jour' : 'Créer')}
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </Layout>
  );
};

export default ProfesseurManagement;