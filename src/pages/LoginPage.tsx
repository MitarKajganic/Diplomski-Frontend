// src/pages/LoginPage.tsx
import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import backgroundImage from '../assets/images/jason-leung-poI7DelFiVA-unsplash.jpg';
import OAuth2LoginButton from '../components/auth/OAuth2LoginButton';
import { Container, Divider, Typography, Box } from '@mui/material';
import '@fontsource/pacifico/400.css';
import '@fontsource/league-spartan/400.css';

const LoginPage: React.FC = () => {
  return (
    <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
      {/* Blurred and Darkened Background */}
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: ' brightness(0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />

      {/* Overlay for Enhanced Contrast */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0,
        }}
      />

      {/* Content Container */}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          borderRadius: 2,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(5px)',
          border: '0.5px solid rgba(255, 255, 255, 0.1)',
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
  );
};

export default LoginPage;
