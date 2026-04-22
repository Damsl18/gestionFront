// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/authService';
import { tokenStorage } from '../api/tokenStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Au montage : tente de restaurer la session depuis localStorage
  useEffect(() => {
    const init = async () => {
      const storedUser = tokenStorage.getUser();
      const hasToken = !!tokenStorage.getAccess();

      if (hasToken && storedUser) {
        // Optimistic : on affiche tout de suite l'utilisateur stocké
        setUser(storedUser);

        // Puis on rafraîchit en arrière-plan
        try {
          const fresh = await authService.fetchCurrentUser();
          setUser(fresh);
        } catch (err) {
          // Token invalide → déconnexion silencieuse
          console.warn('[auth] session invalide', err);
          tokenStorage.clear();
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (username, password) => {
    setError(null);
    try {
      const u = await authService.login(username, password);
      setUser(u);
      return u;
    } catch (err) {
      setError(err.message || 'Échec de la connexion');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  // Helpers de rôle (centralisés ici pour éviter de dupliquer la logique)
  const isChef = user?.user_type === 'CLIENT' || user?.user_type === 'SUPERADMIN';
  const isEmploye = user?.user_type === 'WORKER';
  const hasRole = (roles) => user && roles.includes(user.user_type);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isChef,
    isEmploye,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook custom pour consommer le contexte
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un <AuthProvider>');
  }
  return ctx;
};
