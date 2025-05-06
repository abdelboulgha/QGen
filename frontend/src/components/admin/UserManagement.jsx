import React, { useState } from 'react';
import Layout from '../common/Layout';
import './UserManagement.css';

const UserManagement = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Dupont', email: 'alice@example.com' },
    { id: 2, name: 'Bob Martin', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Durand', email: 'charlie@example.com' },
  ]);

  const [newStudent, setNewStudent] = useState({ name: '', email: '' });
  const [searchTerm, setSearchTerm] = useState(''); // État pour le filtre

  // Supprimer un étudiant
  const handleDeleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  // Modifier un étudiant
  const handleEditStudent = (id) => {
    const studentToEdit = students.find(student => student.id === id);
    setNewStudent(studentToEdit);
  };

  // Créer ou mettre à jour un étudiant
  const handleSaveStudent = () => {
    if (newStudent.id) {
      // Mettre à jour un étudiant existant
      setStudents(students.map(student => (student.id === newStudent.id ? newStudent : student)));
    } else {
      // Créer un nouvel étudiant
      setStudents([...students, { ...newStudent, id: students.length + 1 }]);
    }
    setNewStudent({ name: '', email: '' });
  };

  // Filtrer les étudiants par nom
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Gestion des Étudiants" userRole="admin">
      {/* Champ de recherche */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Formulaire pour créer ou modifier un étudiant */}
      <div className="student-form">
        <h3>{newStudent.id ? 'Modifier Étudiant' : ''}</h3>
        <input
          type="text"
          placeholder="Nom"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newStudent.email}
          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
        />
        <button onClick={handleSaveStudent}>
          {newStudent.id ? 'Mettre à Jour' : 'Créer'}
        </button>
      </div>

      {/* Tableau des étudiants */}
      <table className="student-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>
                <button onClick={() => handleEditStudent(student.id)}>Modifier</button>
                <button onClick={() => handleDeleteStudent(student.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default UserManagement;