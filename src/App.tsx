import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OAuth2Callback from './pages/OAuth2Callback';
import ProtectedRoute from './components/ProtectedRoute';
import Orders from './pages/Orders';
import Reservations from './pages/ReservationsCreate';
import ReservationConfirmation from './pages/ReservationConfirmation';
import UserReservations from './pages/UserReservations';
import ReservationFind from './pages/ReservationFind';
import EditOrder from './pages/EditOrder';
import EditReservation from './pages/EditReservation';
import AdminPage from './pages/Admin'; 
import NotFoundPage from './pages/NotFoundPage';
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
        <Route path="/orders" element={<Orders />} /> {/* Orders Page */}
        <Route path="/orders/:orderId" element={<OrderConfirmation />} /> {/* Order Confirmation with orderId */}
        <Route path="/orders/:orderId/edit" element={<EditOrder />} /> {/* Edit Order Page */}
        <Route path="/reservations/create" element={<Reservations />} /> {/* Reservations Page */}
        <Route path="/reservations/find" element={<ReservationFind />} /> {/* Find Reservation Page */}
        <Route path="/reservations/:reservationId" element={<ReservationConfirmation />} /> {/* Reservation Confirmation */}
        <Route path="/reservations/:reservationId/edit" element={<EditReservation />} /> {/* Edit Reservation Page */}
        <Route path="/user-reservations" element={<UserReservations />} /> {/* User Reservations Page */}
        <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
        <Route path="/register" element={<RegistrationPage />} /> {/* Registration Page */}
        <Route path="*" element={<NotFoundPage />} /> {/* 404 Page */}
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegistration = location.pathname === '/register';
  const isLandingPage = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

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
        animate={{ opacity: isLoginPage || isRegistration || isDashboard ? 1 : 0 }}
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
          zIndex: -1,
          transition: 'background-color 0.3s ease',
        }}
      />

      {/* Animated Routes */}
      <AnimatedRoutes />
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
        position="top-left"
        autoClose={700}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={1}
      />
    </ThemeProvider>
  );
};

export default App;
