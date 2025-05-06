import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';

const ProfessorStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch students
  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      const mockStudents = [
        {
          id: 's1',
          name: 'Alice Dupont',
          email: 'alice.dupont@example.com',
          joinedAt: '2025-01-15',
        },
        {
          id: 's2',
          name: 'Bob Martin',
          email: 'bob.martin@example.com',
          joinedAt: '2025-02-10',
        },
        {
          id: 's3',
          name: 'Charlie Durand',
          email: 'charlie.durand@example.com',
          joinedAt: '2025-03-05',
        },
      ];

      setStudents(mockStudents);
      setLoading(false);
    }, 800);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter students by name
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Liste des Étudiants" userRole="professor">
      
      <div className="filters mt-4">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un étudiant par nom..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Chargement des étudiants...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="no-results">
          <p>Aucun étudiant ne correspond à vos critères.</p>
        </div>
      ) : (
        <div className="table-container mt-4" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Date de Rejoindre</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default ProfessorStudents;