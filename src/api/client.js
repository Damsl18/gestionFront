// src/api/client.js
// Wrapper fetch avec JWT auto-refresh

import { tokenStorage } from './tokenStorage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Variables globales pour gérer le refresh concurrent
let isRefreshing = false;
let refreshQueue = []; // requêtes en attente du nouveau token

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

/**
 * Tente de rafraîchir le token d'accès via le refresh token.
 * Renvoie le nouveau access token, ou null en cas d'échec.
 */
const refreshAccessToken = async () => {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    tokenStorage.setTokens(data.access, data.refresh || refresh);
    return data.access;
  } catch (err) {
    console.error('[refresh] failed', err);
    return null;
  }
};

/**
 * Fonction principale : effectue une requête HTTP authentifiée.
 *
 * @param {string} path - chemin relatif (ex: '/items/')
 * @param {object} options - { method, body, headers, isFormData, skipAuth }
 * @returns {Promise<any>} - réponse JSON parsée (ou Blob si demandé)
 */
export const apiRequest = async (path, options = {}) => {
  const {
    method = 'GET',
    body,
    headers = {},
    isFormData = false,
    skipAuth = false,
    responseType = 'json', // 'json' | 'blob' | 'text'
  } = options;

  const buildHeaders = () => {
    const h = { ...headers };
    if (!isFormData && body) h['Content-Type'] = 'application/json';

    if (!skipAuth) {
      const access = tokenStorage.getAccess();
      if (access) h['Authorization'] = `Bearer ${access}`;
    }
    return h;
  };

  const buildBody = () => {
    if (!body) return undefined;
    if (isFormData) return body; // FormData direct
    return JSON.stringify(body);
  };

  const url = `${BASE_URL}${path}`;

  let response = await fetch(url, {
    method,
    headers: buildHeaders(),
    body: buildBody(),
  });

  // Si 401 → tentative de refresh une seule fois
  if (response.status === 401 && !skipAuth) {
    if (isRefreshing) {
      // Une autre requête est déjà en train de refresh : on attend
      try {
        await new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        });
        // Rejoue la requête originale avec le nouveau token
        response = await fetch(url, {
          method,
          headers: buildHeaders(),
          body: buildBody(),
        });
      } catch {
        tokenStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expirée');
      }
    } else {
      isRefreshing = true;
      const newAccess = await refreshAccessToken();
      isRefreshing = false;

      if (newAccess) {
        processQueue(null, newAccess);
        // Rejoue la requête originale
        response = await fetch(url, {
          method,
          headers: buildHeaders(),
          body: buildBody(),
        });
      } else {
        processQueue(new Error('Refresh failed'));
        tokenStorage.clear();
        window.location.href = '/login';
        throw new Error('Session expirée');
      }
    }
  }

  // Gestion des erreurs HTTP
  if (!response.ok) {
    let errorPayload;
    try {
      errorPayload = await response.json();
    } catch {
      errorPayload = { detail: response.statusText };
    }
    const error = new Error(
      errorPayload.detail ||
      errorPayload.message ||
      JSON.stringify(errorPayload) ||
      `Erreur ${response.status}`
    );
    error.status = response.status;
    error.payload = errorPayload;
    throw error;
  }

  // 204 No Content
  if (response.status === 204) return null;

  // Réponse selon le type demandé
  if (responseType === 'blob') return response.blob();
  if (responseType === 'text') return response.text();
  return response.json();
};

// Helpers pratiques
export const api = {
  get: (path, options = {}) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => apiRequest(path, { ...options, method: 'POST', body }),
  put: (path, body, options = {}) => apiRequest(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options = {}) => apiRequest(path, { ...options, method: 'PATCH', body }),
  delete: (path, options = {}) => apiRequest(path, { ...options, method: 'DELETE' }),
};
