import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { AuthGateProvider } from './context/AuthGateContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <AuthProvider>
  <AuthGateProvider>
 <App />
  </AuthGateProvider>
  </AuthProvider>
   
  </BrowserRouter>
);

reportWebVitals();
