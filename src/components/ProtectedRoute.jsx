// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from './LoadingScreen';

/**
 * Protège une route :
 * - Si non authentifié → redirige vers /login (en mémorisant la cible)
 * - Si rôle insuffisant → redirige vers /unauthorized
 *
 * Usage :
 *   <ProtectedRoute><Dashboard /></ProtectedRoute>
 *   <ProtectedRoute roles={['CLIENT', 'SUPERADMIN']}><Employees /></ProtectedRoute>
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.user_type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
