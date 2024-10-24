import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import OAuth2LoginButton from '../components/auth/OAuth2LoginButton';
import { Container, Divider, Typography, Box } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <LoginForm />
        <Divider sx={{ width: '100%', my: 2 }}>OR</Divider>
        <OAuth2LoginButton />
      </Box>
    </Container>
  );
};

export default LoginPage;
