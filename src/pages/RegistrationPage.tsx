// src/pages/RegistrationPage.tsx

import React from 'react';
import RegistrationForm from '../components/auth/RegistrationForm';
import { Container, Typography, Box, Link } from '@mui/material';
import '@fontsource/pacifico/400.css';
import '@fontsource/league-spartan/400.css';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 },
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
      {/* Content Container */}
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          position: 'relative',
          zIndex: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        {/* Content Box */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            borderRadius: 2,
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)',
            border: '0.5px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* "Register" Heading */}
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontFamily: 'Pacifico, cursive',
              color: 'primary.main',
              fontWeight: 'normal',
              mb: 2,
            }}
          >
            Register
          </Typography>

          {/* Registration Form */}
          <RegistrationForm />

          {/* OAuth2 Registration Button */}
          {/* If you have OAuth2 registration similar to login, you can include it here */}
          {/* <OAuth2RegistrationButton /> */}

          {/* Redirect to Login */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontFamily: 'League Spartan, sans-serif', color: 'rgba(255, 255, 255, 0.8)' }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
};

export default RegistrationPage;
