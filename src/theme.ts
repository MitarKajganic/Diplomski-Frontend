// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D4AF37',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#000000',
    },
    background: {
      default: '#141414',
      paper: 'rgba(64, 64, 64, 1)',
    },
    text: {
      primary: '#FFFFFF', // Set primary text to white
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: 'League Spartan, sans-serif',
    h4: {
      fontFamily: 'Pacifico, cursive',
      color: '#D4AF37',
      fontWeight: 'normal',
    },
    h5: {
      fontFamily: 'League Spartan, sans-serif',
      color: '#FFFFFF',
      fontWeight: 400,
    },
    body1: {
      fontFamily: 'League Spartan, sans-serif',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '12px 20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#FFFFFF',
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: 'League Spartan, sans-serif',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          color: '#FFFFFF',
          fontFamily: 'League Spartan, sans-serif',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#333333', // Dark gray background for the popover
          opacity: 1,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
          color: '#FFFFFF', // Set text color to white
        },
      },
    },
  },
});

export default theme;
