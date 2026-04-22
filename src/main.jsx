import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Import Bootstrap CSS (obligatoire pour que les classes fonctionnent)
import 'bootstrap/dist/css/bootstrap.min.css'
// Import Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css'

// Nos styles personnalisés (on les créera à l'étape 3)
import './styles/variables.css'
import './styles/theme.css'
import './styles/global.css'
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
