import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import QuizDetails from './components/professor/QuizDetails';
// Common Components
import Header from './components/common/GlobalHeader';
import Footer from './components/common/Footer';
import Sidebar from './components/common/GlobalSidebar';

// Authentication Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ProfManagement from './components/admin/profManagement';

// Professor Components
import ProfessorDashboard from './components/professor/ProfessorDashboard';
import QuizCreation from './components/professor/QuizCreation';
import QuizManagement from './components/professor/QuizManagement';
import ResultsAnalysis from './components/professor/ResultsAnalysis';
import ProfessorStudents from './components/professor/ProfessorStudents';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import QuizTaking from './components/student/QuizTaking';
import ResultsView from './components/student/ResultsView';

import './App.css';

// Composant de mise en page conditionnelle
const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={isAuthPage ? 'auth-layout' : 'app-layout'}>
      {/* N'affiche pas le Header sur les pages d'authentification */}
      {!isAuthPage && <Header />}
      <div className={isAuthPage ? 'auth-content' : 'main-content'}>
        {children}
      </div>
      {/* N'affiche pas le Footer sur les pages d'authentification */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Redirection vers la page de connexion */}
            <Route
              path="/"
              element={
                <ConditionalLayout>
                  <Navigate to="/login" />
                </ConditionalLayout>
              }
            />

            {/* Public Routes - Sans Header ni Footer */}
            <Route
              path="/login"
              element={
                <ConditionalLayout>
                  <Login />
                </ConditionalLayout>
              }
            />
            <Route
              path="/register"
              element={
                <ConditionalLayout>
                  <Register />
                </ConditionalLayout>
              }
            />

            {/* Admin Routes - Avec Header et Footer */}
            <Route
              path="/admin"
              element={
                <ConditionalLayout>
                  <ProtectedRoute role="admin">
                    <div className="dashboard-layout">
                      <Sidebar userRole="admin" />
                      <AdminDashboard />
                    </div>
                  </ProtectedRoute>
                </ConditionalLayout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ConditionalLayout>
                  <ProtectedRoute role="admin">
                    <div className="dashboard-layout">
                      <Sidebar userRole="admin" />
                      <UserManagement />
                    </div>
                  </ProtectedRoute>
                </ConditionalLayout>
              }
            />
            <Route
              path="/admin/professors"
              element={
                <ConditionalLayout>
                  <ProtectedRoute role="admin">
                    <div className="dashboard-layout">
                      <Sidebar userRole="admin" />
                      <ProfManagement />
                    </div>
                  </ProtectedRoute>
                </ConditionalLayout>
              }
            />

            {/* Professor Routes - Avec Header et Footer */}
            <Route
              path="/professor"
              element={
                <ConditionalLayout>
                  <ProtectedRoute role="professor">
                    <div className="dashboard-layout">
                      <Sidebar userRole="professor" />
                      <ProfessorDashboard />
                    </div>
                  </ProtectedRoute>
                </ConditionalLayout>
              }
            />
            <Route
              path="/professor/create-quiz"
              element={
                <ConditionalLayout>
                  <ProtectedRoute role="professor">
                    <div className="dashboard-layout">
                      <Sidebar userRole="professor" />
                      <QuizCreation />
                    </div>
                  </ProtectedRoute>
                </ConditionalLayout>
              }
            />
            <Route
              path="/professor/manage-quiz"
              element={
                <ConditionalLayout>
                  <ProtectedRoute role="professor">
                    <div className="dashboard-layout">
                      <Sidebar userRole="professor" />
                      <QuizManagement />
                    </div>
                  </ProtectedRoute>
                </ConditionalLayout>
              }
            />
            <Route
              path="/professor/results"
              element={
                <ConditionalLayout>
                  <ProtectedRoute role="professor">
                    <div className="dashboard-layout">
                      <Sidebar userRole="professor" />
                      <ResultsAnalysis />
                    </div>
                  </ProtectedRoute>
                </ConditionalLayout>
              }
            />
            <Route
              path="/professor/quiz-details/:id"
              element={
                <ConditionalLayout>
                  <ProtectedRoute role="professor">
                    <div className="dashboard-layout">
                      <Sidebar userRole="professor" />
                      <QuizDetails />
                    </div>
                  </ProtectedRoute>
                </ConditionalLayout>
              }
            />
            <Route
              path="/professor/students"
              element={
                <ConditionalLayout>
                  <ProtectedRoute role="professor">
                    <div className="dashboard-layout">
                      <Sidebar userRole="professor" />
                      <ProfessorStudents />
                    </div>
                  </ProtectedRoute>
                </ConditionalLayout>
              }
            />

            {/* Student Routes - Avec Header et Footer */}
            <Route
              path="/student"
              element={
                <ConditionalLayout>
                  <ProtectedRoute role="student">
                    <div className="dashboard-layout">
                      <Sidebar userRole="student" />
                      <StudentDashboard />
                    </div>
                  </ProtectedRoute>
                </ConditionalLayout>
              }
            />
            <Route
              path="/student/take-quiz/:id"
              element={
                <ConditionalLayout>
                  <ProtectedRoute role="student">
                    <div className="dashboard-layout">
                      <Sidebar userRole="student" />
                      <QuizTaking />
                    </div>
                  </ProtectedRoute>
                </ConditionalLayout>
              }
            />
            <Route
              path="/student/results"
              element={
                <ConditionalLayout>
                  <ProtectedRoute role="student">
                    <div className="dashboard-layout">
                      <Sidebar userRole="student" />
                      <ResultsView />
                    </div>
                  </ProtectedRoute>
                </ConditionalLayout>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;