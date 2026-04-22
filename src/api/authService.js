// src/api/authService.js
// Logique métier de l'authentification

import { api } from './client';
import { ENDPOINTS } from './endpoints';
import { tokenStorage } from './tokenStorage';

export const authService = {
  /**
   * Connexion : POST /auth/token/ avec username/password
   * Stocke les tokens et récupère le profil utilisateur
   */
  async login(username, password) {
    // 1. Récupérer les tokens
    const tokens = await api.post(
      ENDPOINTS.login,
      { username, password },
      { skipAuth: true }
    );

    if (!tokens.access || !tokens.refresh) {
      throw new Error('Réponse invalide du serveur');
    }

    tokenStorage.setTokens(tokens.access, tokens.refresh);

    // 2. Récupérer le profil utilisateur
    const user = await api.get(ENDPOINTS.me);
    tokenStorage.setUser(user);

    return user;
  },

  /**
   * Déconnexion : nettoie le localStorage
   */
  async logout() {
    tokenStorage.clear();
  },

  /**
   * Récupère l'utilisateur courant depuis l'API (pour rafraîchir le profil)
   */
  async fetchCurrentUser() {
    const user = await api.get(ENDPOINTS.me);
    tokenStorage.setUser(user);
    return user;
  },

  /**
   * Renvoie l'utilisateur depuis le localStorage (synchrone)
   */
  getStoredUser() {
    return tokenStorage.getUser();
  },

  isAuthenticated() {
    return !!tokenStorage.getAccess();
  },
};
