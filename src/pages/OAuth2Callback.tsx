import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Typography, Container, Box, Alert } from '@mui/material';
// import api from '../services/api';

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
          // Optional: Verify the token with the backend
          // For example, make a request to /api/auth/me to get user info
          // const userResponse = await api.get('/api/auth/me');
          login(token);
          navigate('/dashboard');
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
