import React from 'react';
import backgroundImage from '../assets/images/jason-leung-poI7DelFiVA-unsplash.jpg';
import { Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '@fontsource/pacifico/400.css';
import '@fontsource/league-spartan/400.css';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';

const HomeAlternative: React.FC = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/dashboard');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      {/* Blurred Background */}
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // filter: 'blur(8px)',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          textAlign: 'center',
          px: 2,
          zIndex: 2,
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
            gap: 2, // Space between links
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
        </Box>
      </Box>
    </>
  );
};

export default HomeAlternative;
