// src/pages/LoginPage.tsx
import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import OAuth2LoginButton from '../components/auth/OAuth2LoginButton';
import { Container, Divider, Typography, Box } from '@mui/material';
import '@fontsource/pacifico/400.css';
import '@fontsource/league-spartan/400.css';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
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
          {/* "Sign In" Heading */}
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
            Sign In
          </Typography>

          {/* Login Form */}
          <LoginForm />

          {/* "OR" Divider */}
          <Divider sx={{ width: '100%', my: 3, borderColor: 'white' }}>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'League Spartan, sans-serif',
                color: 'rgba(255, 255, 255, 0.7)',
                paddingX: 2,
              }}
            >
              OR
            </Typography>
          </Divider>

          {/* OAuth2 Login Button */}
          <OAuth2LoginButton />
        </Box>
      </Container>
    </motion.div>
  );
};

export default LoginPage;
