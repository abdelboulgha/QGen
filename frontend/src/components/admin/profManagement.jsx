import React, { useState } from 'react';
import Layout from '../common/Layout';
import './ProfManagement.css';

const ProfManagement = () => {
  const [professors, setProfessors] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com' },
    { id: 2, name: 'Marie Curie', email: 'marie@example.com' },
    { id: 3, name: 'Albert Einstein', email: 'albert@example.com' },
  ]);

  const [newProfessor, setNewProfessor] = useState({ name: '', email: '' });
  const [searchTerm, setSearchTerm] = useState(''); // État pour le filtre

  // Supprimer un professeur
  const handleDeleteProfessor = (id) => {
    setProfessors(professors.filter(professor => professor.id !== id));
  };

  // Modifier un professeur
  const handleEditProfessor = (id) => {
    const professorToEdit = professors.find(professor => professor.id === id);
    setNewProfessor(professorToEdit);
  };

  // Créer ou mettre à jour un professeur
  const handleSaveProfessor = () => {
    if (newProfessor.id) {
      // Mettre à jour un professeur existant
      setProfessors(professors.map(professor => (professor.id === newProfessor.id ? newProfessor : professor)));
    } else {
      // Créer un nouveau professeur
      setProfessors([...professors, { ...newProfessor, id: professors.length + 1 }]);
    }
    setNewProfessor({ name: '', email: '' });
  };

  // Filtrer les professeurs par nom
  const filteredProfessors = professors.filter(professor =>
    professor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Gestion des Professeurs" userRole="admin">
      <h2>Gestion des Professeurs</h2>

      {/* Champ de recherche */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Formulaire pour créer ou modifier un professeur */}
      <div className="professor-form">
        <h3>{newProfessor.id ? 'Modifier Professeur' : ''}</h3>
        <input
          type="text"
          placeholder="Nom"
          value={newProfessor.name}
          onChange={(e) => setNewProfessor({ ...newProfessor, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newProfessor.email}
          onChange={(e) => setNewProfessor({ ...newProfessor, email: e.target.value })}
        />
        <button onClick={handleSaveProfessor}>
          {newProfessor.id ? 'Mettre à Jour' : 'Créer'}
        </button>
      </div>

      {/* Tableau des professeurs */}
      <table className="professor-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfessors.map(professor => (
            <tr key={professor.id}>
              <td>{professor.name}</td>
              <td>{professor.email}</td>
              <td>
                <button onClick={() => handleEditProfessor(professor.id)}>Modifier</button>
                <button onClick={() => handleDeleteProfessor(professor.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default ProfManagement;