import React, { useContext } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '@fontsource/pacifico/400.css';
import '@fontsource/league-spartan/400.css';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleEnter = () => {
    navigate('/home');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const pageVariants = {
    initial: { opacity: 0, x: -50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 50 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {/* Content */}
      <Box
        sx={{
          color: 'white',
          textAlign: 'center',
          px: 2,
          zIndex: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        {/* Main Heading */}
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontFamily: 'Pacifico, cursive',
            fontWeight: 'normal',
            fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
          }}
        >
          Welcome to Our Restaurant
        </Typography>

        {/* Subtext */}
        <Typography
          variant="h5"
          component="p"
          gutterBottom
          sx={{
            fontFamily: 'League Spartan, sans-serif',
            fontWeight: 400,
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
            mb: 4,
          }}
        >
          Experience the finest dining with us.
        </Typography>

        {/* Clickable Text Links */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: { xs: '80%', sm: '60%', md: '40%' },
          }}
        >
          <Link
            component="button"
            variant="h6"
            onClick={handleEnter}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
              cursor: 'pointer',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              '&:hover': {
                color: 'secondary.main',
                textDecoration: 'underline',
              },
              transition: 'color 0.3s ease, text-decoration 0.3s ease',
            }}
          >
            <DashboardIcon sx={{ mr: 1 }} />
            Enter
          </Link>

          {user ? (
            <Link
              component="button"
              variant="h6"
              onClick={handleLogout}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
                cursor: 'pointer',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                '&:hover': {
                  color: 'secondary.main',
                  textDecoration: 'underline',
                },
                transition: 'color 0.3s ease, text-decoration 0.3s ease',
              }}
            >
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </Link>
          ) : (
            <Link
              component="button"
              variant="h6"
              onClick={handleLogin}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
                cursor: 'pointer',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                '&:hover': {
                  color: 'secondary.main',
                  textDecoration: 'underline',
                },
                transition: 'color 0.3s ease, text-decoration 0.3s ease',
              }}
            >
              <LoginIcon sx={{ mr: 1 }} />
              Login
            </Link>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default Home;