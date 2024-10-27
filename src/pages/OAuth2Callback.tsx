import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Typography, Container, Box, Alert } from '@mui/material';

const OAuth2Callback: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuth2Callback = async () => {
      const query = new URLSearchParams(location.search);
      const token = query.get('token');

      if (token) {
        try {
          console.log(token)
          login(token);
          navigate('/home');
        } catch (err: any) {
          console.error('OAuth2 Login failed:', err);
          setError('Authentication failed. Please try again.');
          navigate('/login');
        }
      } else {
        setError('Token not found. Authentication failed.');
        navigate('/login');
      }
    };

    handleOAuth2Callback();
  }, [location.search, login, navigate]);

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Authenticating...
        </Typography>
      </Box>
    </Container>
  );
};

export default OAuth2Callback;
