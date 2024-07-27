import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Dashboard from './Features/Dashboard';
import Login from './Features/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <Dashboard />
    {/* <Login /> */}
  </React.StrictMode>
);

reportWebVitals();
