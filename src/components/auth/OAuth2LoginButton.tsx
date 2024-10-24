import React from 'react';
import { Button } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

const OAuth2LoginButton: React.FC = () => {
  // const navigate = useNavigate();

  const handleOAuthLogin = () => {
    // Implement your OAuth2 login logic here
    // For example, redirect to your backend's OAuth2 endpoint
    window.location.href = 'http://localhost:8080/auth/google';
  };

  return (
    <Button
      onClick={handleOAuthLogin}
      fullWidth
      variant="outlined"
      startIcon={<GoogleIcon />}
      sx={{
        borderColor: 'primary.main',
        color: 'primary.main',
        fontWeight: 'bold',
        textTransform: 'none',
        border: '2px solid',
        '&:hover': {
          backgroundColor: 'black',
          color: 'white',
          borderColor: 'primary.main',
        },
        height: '50px',
        fontSize: '1rem',
        fontFamily: 'League Spartan, sans-serif',
      }}
    >
      Sign in with Google
    </Button>
  );
};

export default OAuth2LoginButton;
