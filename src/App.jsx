// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages (placeholders pour l'instant ; on les construit aux étapes suivantes)
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout (créé à l'étape 7)
// import Layout from './components/Layout';
// import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Routes protégées (on activera Layout à l'étape 7) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {/* <Layout /> */}
              <TempHome />
            </ProtectedRoute>
          }
        />

        {/* Exemple de route protégée par rôle */}
        <Route
          path="/employees"
          element={
            <ProtectedRoute roles={['CLIENT', 'SUPERADMIN']}>
              <TempEmployees />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

// Composants temporaires pour valider l'étape 5 avant de construire le vrai layout
const TempHome = () => (
  <div className="container py-5 text-center">
    <h1 className="neon-text">✅ Authentifié</h1>
    <p>Tu vois cette page = AuthContext OK + ProtectedRoute OK</p>
  </div>
);
const TempEmployees = () => (
  <div className="container py-5 text-center">
    <h1 className="neon-text">👥 Employés (Chef uniquement)</h1>
  </div>
);

export default App;
