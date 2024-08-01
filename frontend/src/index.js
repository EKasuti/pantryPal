import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import logo from './images/logo/logo.png';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Favicon
const favicon = document.querySelector('link[rel="icon"]');
if (favicon) {
  favicon.href = logo;
}

reportWebVitals();
