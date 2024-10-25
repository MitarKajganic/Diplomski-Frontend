// src/pages/LoginForm.tsx
import React, { useContext, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { LoginResponse } from '../../types/Interfaces';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import '@fontsource/pacifico/400.css';
import '@fontsource/league-spartan/400.css';

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      const response = await api.post<LoginResponse>('/api/auth/login', data);
      const { token } = response.data;
      login(token);
      navigate('/home');
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      setServerError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      {/* Server Error Alert */}
      {serverError && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error" sx={{ fontFamily: 'League Spartan' }}>
            {serverError}
          </Alert>
        </Box>
      )}
      
      {/* Email Field */}
      <TextField
        variant="filled"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        autoComplete="email"
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email address',
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
        slotProps={{
          input: {
            sx: {
              color: 'white',
              fontFamily: 'League Spartan',
            },
          },
        }}
        InputLabelProps={{
          sx: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'League Spartan',
          },
        }}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 1,
          mb: 2,
          transition: 'background-color 0.3s ease',
          '&:hover .MuiFilledInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        }}
        InputProps={{
          disableUnderline: true,
        }}
      />

      {/* Password Field */}
      <TextField
        variant="filled"
        margin="normal"
        required
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        {...register('password', { 
          required: 'Password is required',
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message: 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit',
          },
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
        slotProps={{
          input: {
            sx: {
              color: 'white',
              fontFamily: 'League Spartan',
            },
          },
        }}
        InputLabelProps={{
          sx: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'League Spartan',
          },
        }}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 1,
          mb: 3,
          transition: 'background-color 0.3s ease',
          '&:hover .MuiFilledInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        }}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="outlined"
        color="primary"
        disabled={loading}
        sx={{
          mt: 3,
          mb: 2,
          color: 'primary.main',
          border: '2px solid',
          borderColor: 'primary.main',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: 'black',
            borderColor: 'primary.main',
            color: 'white',
          },
          height: '50px',
          fontSize: '1rem',
          fontFamily: 'League Spartan',
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>
    </Box>
  );
};

export default LoginForm;
