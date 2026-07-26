import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Apply saved theme before rendering to prevent FOUC
const savedPref = localStorage.getItem('parkease-theme') || 'system';
let applyDark = false;

if (savedPref === 'dark') {
  applyDark = true;
} else if (savedPref === 'system') {
  applyDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
}
// savedPref === 'light' → applyDark stays false

if (applyDark) {
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
