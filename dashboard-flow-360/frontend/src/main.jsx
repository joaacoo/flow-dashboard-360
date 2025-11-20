import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Inicializar tema antes de renderizar
const savedTheme = localStorage.getItem('flowDarkMode');
const isDark = savedTheme === 'true';
if (isDark) {
  document.documentElement.classList.add('dark');
  document.body.classList.add('dark');
  document.documentElement.setAttribute('data-theme', 'dark');
  document.documentElement.style.colorScheme = 'dark';
} else {
  document.documentElement.classList.remove('dark');
  document.body.classList.remove('dark');
  document.documentElement.setAttribute('data-theme', 'light');
  document.documentElement.style.colorScheme = 'light';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
