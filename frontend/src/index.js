import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { AuthGateProvider } from './context/AuthGateContext';
import axios from 'axios';

// Set backend API URL for production live site
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" &&
   window.location.hostname !== "localhost" &&
   window.location.hostname !== "127.0.0.1"
    ? "https://event-management-livid-ten.vercel.app"
    : "");

if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}
axios.defaults.withCredentials = true;


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
