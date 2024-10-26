import React, { useState, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import '@fontsource/pacifico/400.css';
import '@fontsource/league-spartan/400.css';

interface RegistrationFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationForm: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegistrationFormInputs>();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

const onSubmit: SubmitHandler<RegistrationFormInputs> = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
        // Call your registration API endpoint
        await api.post('/users/create', {
            email: data.email,
            password: data.password,
        });

        // Call the login API endpoint
        const response = await api.post('/api/auth/login', {
            email: data.email,
            password: data.password,
        });

        // Log the user in
        const { token } = response.data as { token: string };
        login(token);
        navigate('/home');
    } catch (error: any) {
        console.error('Registration failed:', error.response?.data?.message || error.message);
        setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
        setLoading(false);
    }
};

  // Watch password field to validate confirm password
  const password = watch('password', '');

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
        type="password"
        id="password"
        autoComplete="new-password"
        {...register('password', { 
          required: 'Password is required',
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
            message: 'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
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

      {/* Confirm Password Field */}
      <TextField
        variant="filled"
        margin="normal"
        required
        fullWidth
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        {...register('confirmPassword', { 
          required: 'Please confirm your password',
          validate: value =>
            value === password || 'Passwords do not match',
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
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
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
      </Button>
    </Box>
  );
};

export default RegistrationForm;