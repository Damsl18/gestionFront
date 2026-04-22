// src/components/LoadingScreen.jsx
const LoadingScreen = ({ message = 'Chargement...' }) => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '100vh', backgroundColor: 'var(--venom-black)' }}
    >
      <div
        className="spinner-border"
        style={{ color: 'var(--neon-green)', width: '3rem', height: '3rem' }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 neon-text">{message}</p>
    </div>
  );
};

export default LoadingScreen;
