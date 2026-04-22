// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div
    className="d-flex flex-column align-items-center justify-content-center text-center"
    style={{ minHeight: '100vh', backgroundColor: 'var(--venom-black)' }}
  >
    <h1 className="neon-text" style={{ fontSize: '6rem' }}>404</h1>
    <p className="text-secondary">Cette page n'existe pas.</p>
    <Link to="/" className="btn btn-neon mt-3">Retour</Link>
  </div>
);

export default NotFoundPage;
