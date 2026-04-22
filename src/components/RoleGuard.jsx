// src/components/RoleGuard.jsx
import { useAuth } from '../contexts/AuthContext';

/**
 * Affiche conditionnellement ses enfants selon le rôle.
 * Différent de ProtectedRoute : ne redirige pas, ne fait que cacher.
 *
 * Usage :
 *   <RoleGuard roles={['CLIENT', 'SUPERADMIN']}>
 *     <button>Modifier le prix</button>
 *   </RoleGuard>
 */
const RoleGuard = ({ roles, fallback = null, children }) => {
  const { user } = useAuth();
  if (!user) return fallback;
  if (!roles || roles.length === 0) return children;
  if (!roles.includes(user.user_type)) return fallback;
  return children;
};

export default RoleGuard;
