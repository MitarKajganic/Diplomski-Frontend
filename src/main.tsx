import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CssBaseline from '@mui/material/CssBaseline';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CartProvider>
      <AuthProvider>
        <CssBaseline />
        <App />
      </AuthProvider>
    </CartProvider>
  </React.StrictMode>
);
