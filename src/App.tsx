// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import Menu from './pages/Menu';
import OAuth2Callback from './pages/OAuth2Callback';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';
import { AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';
import backgroundImage from './assets/images/jason-leung-poI7DelFiVA-unsplash.jpg';
import { motion } from 'framer-motion';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} /> {/* Landing Page */}
        <Route path="/home" element={<Home />} /> {/* Home Page with Navbar */}
        <Route path="/menu" element={<Menu />} /> {/* Menu Page */}
        <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </AnimatePresence>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {/* Global Background Image */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -3,
        }}
      />

      {/* Blur Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoginPage ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backdropFilter: 'brightness(0.5) blur(8px)',
          WebkitBackdropFilter: 'brightness(0.5) blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          zIndex: -2,
          pointerEvents: 'none',
        }}
      />

      {/* Global Overlay for Enhanced Contrast */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: isLandingPage ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)',
          zIndex: -1, // Above the blur overlay
          transition: 'background-color 0.3s ease',
        }}
      />

      {/* Animated Routes */}
      <CartProvider>
        <AnimatedRoutes />
      </CartProvider>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
};

export default App;
