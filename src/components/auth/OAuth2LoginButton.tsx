import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const OAuth2LoginButton: React.FC = () => {
  const handleLogin = () => {
    // Redirect to backend's OAuth2 authorization endpoint with state parameter
    window.location.href = 'http://localhost:8080/oauth2/authorization/google?state=frontend';
  };

  return (
    <Button
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={handleLogin}
      fullWidth
    >
      Sign in with Google
    </Button>
  );
};

export default OAuth2LoginButton;
