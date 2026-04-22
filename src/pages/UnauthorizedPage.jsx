// src/pages/UnauthorizedPage.jsx
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center p-4"
      style={{ minHeight: '100vh', backgroundColor: 'var(--venom-black)' }}
    >
      <i
        className="bi bi-shield-lock-fill"
        style={{ fontSize: '5rem', color: 'var(--gold)' }}
      ></i>
      <h1 className="mt-3 neon-text">403 — Accès refusé</h1>
      <p className="text-secondary">
        Votre rôle ne vous permet pas d'accéder à cette section.
      </p>
      <Link to="/" className="btn btn-neon mt-3">
        <i className="bi bi-house-door me-2"></i>
        Retour au tableau de bord
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
