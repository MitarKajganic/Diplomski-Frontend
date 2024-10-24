// src/components/Navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Toolbar>
        {/* Logo or Brand Name */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'white',
            fontFamily: 'Pacifico, cursive',
            fontSize: '1.5rem',
            '&:hover': {
              color: 'primary.main',
            },
            transition: 'color 0.3s ease',
          }}
        >
          RestaurantName
        </Typography>

        {/* Navigation Links */}
        <Box>
          <Button
            component={RouterLink}
            to="/home"
            color="inherit"
            sx={{
              fontFamily: 'League Spartan, sans-serif',
              fontWeight: 'bold',
              textTransform: 'none',
              mr: 2,
              '&:hover': {
                color: 'primary.main',
              },
              transition: 'color 0.3s ease',
            }}
          >
            Home
          </Button>
          <Button
            component={RouterLink}
            to="/menu"
            color="inherit"
            sx={{
              fontFamily: 'League Spartan, sans-serif',
              fontWeight: 'bold',
              textTransform: 'none',
              mr: 2,
              '&:hover': {
                color: 'primary.main',
              },
              transition: 'color 0.3s ease',
            }}
          >
            Menu
          </Button>
          <Button
            component={RouterLink}
            to="/about"
            color="inherit"
            sx={{
              fontFamily: 'League Spartan, sans-serif',
              fontWeight: 'bold',
              textTransform: 'none',
              mr: 2,
              '&:hover': {
                color: 'primary.main',
              },
              transition: 'color 0.3s ease',
            }}
          >
            About
          </Button>
          <Button
            component={RouterLink}
            to="/contact"
            color="inherit"
            sx={{
              fontFamily: 'League Spartan, sans-serif',
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                color: 'primary.main',
              },
              transition: 'color 0.3s ease',
            }}
          >
            Contact
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
