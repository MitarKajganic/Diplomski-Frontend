// src/components/Navbar.tsx
import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
} from '@mui/material';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Separate anchor elements for Profile and Mobile menus
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
  const [anchorElMobile, setAnchorElMobile] = useState<null | HTMLElement>(null);

  const openProfile = Boolean(anchorElProfile);
  const openMobile = Boolean(anchorElMobile);

  // Handlers for Profile Menu
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProfile(event.currentTarget);
    setAnchorElMobile(null);
  };

  const handleProfileMenuClose = () => {
    setAnchorElProfile(null);
  };

  // Handlers for Mobile Menu
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMobile(event.currentTarget);
    setAnchorElProfile(null);
  };

  const handleMobileMenuClose = () => {
    setAnchorElMobile(null);
  };

  // Logout Handler
  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  // Determine which buttons to show based on user role
  const renderRoleBasedButtons = () => {
    if (!user) return null;

    const { role } = user;

    return (
      <>
        {/* Order Button - Visible when logged in */}
        <Button
          component={RouterLink}
          to="/order"
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
          Order
        </Button>

        {/* Dashboard Button - Visible for STAFF and ADMIN */}
        {(role === 'STAFF' || role === 'ADMIN') && (
          <Button
            component={RouterLink}
            to="/dashboard"
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
            Dashboard
          </Button>
        )}

        {/* Admin Button - Visible only for ADMIN */}
        {role === 'ADMIN' && (
          <Button
            component={RouterLink}
            to="/admin"
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
            Admin
          </Button>
        )}
      </>
    );
  };

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

        {/* Navigation Links for Desktop */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <Button
            component={RouterLink}
            to="/home"
            color="inherit"
            sx={{
              fontFamily: 'League Spartan, sans-serif',
              fontWeight: isActive('/home') ? 'bold' : 'normal',
              textTransform: 'none',
              mr: 2,
              color: isActive('/home') ? 'primary.main' : 'inherit',
              '&:hover': {
                color: 'primary.main',
              },
              transition: 'color 0.3s ease, font-weight 0.3s ease',
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
              fontWeight: isActive('/menu') ? 'bold' : 'normal',
              textTransform: 'none',
              mr: 2,
              color: isActive('/menu') ? 'primary.main' : 'inherit',
              '&:hover': {
                color: 'primary.main',
              },
              transition: 'color 0.3s ease, font-weight 0.3s ease',
            }}
          >
            Menu
          </Button>
          <Button
            component={RouterLink}
            to="/reservation"
            color="inherit"
            sx={{
              fontFamily: 'League Spartan, sans-serif',
              fontWeight: isActive('/reservation') ? 'bold' : 'normal',
              textTransform: 'none',
              mr: 2,
              color: isActive('/reservation') ? 'primary.main' : 'inherit',
              '&:hover': {
                color: 'primary.main',
              },
              transition: 'color 0.3s ease, font-weight 0.3s ease',
            }}
          >
            Reservation
          </Button>

          {/* Role-Based Buttons */}
          {renderRoleBasedButtons()}

          {/* Login Button for Desktop (Visible when not logged in) */}
          {!user && (
            <Button
              component={RouterLink}
              to="/login"
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
              Login
            </Button>
          )}

          {/* Profile Dropdown for Desktop */}
          {user && (
            <>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={openProfile ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openProfile ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.email.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElProfile}
                id="account-menu"
                open={openProfile}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: '45px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Match navbar background
                    color: 'white',
                    fontFamily: 'League Spartan, sans-serif',
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'rgba(0, 0, 0, 0.7)', // Match navbar background
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleLogout} sx={{ fontFamily: 'League Spartan', color: 'white' }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Mobile Menu Icon */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          {/* Show Profile Avatar only when logged in */}
          {user && (
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ mr: 1 }}
                aria-controls={openProfile ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openProfile ? 'true' : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user.email.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          )}

          {/* Mobile Menu Icon */}
          <IconButton
            size="large"
            aria-label="menu"
            aria-controls="mobile-menu"
            aria-haspopup="true"
            color="inherit"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Profile Dropdown for Mobile */}
        {user && (
          <Menu
            anchorEl={anchorElProfile}
            id="account-menu"
            open={openProfile}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                mt: '45px',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                color: 'white',
                fontFamily: 'League Spartan, sans-serif',
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
                onClick={handleLogout}
                sx={{
                fontFamily: 'League Spartan, sans-serif',
                color: 'white',
                '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                },
                transition: 'color 0.3s ease, background-color 0.3s ease',
                }}
            >
                Logout
            </MenuItem>
          </Menu>
        )}
      </Toolbar>

      {/* Mobile Navigation Menu */}
      <Menu
        id="mobile-menu"
        anchorEl={anchorElMobile}
        open={openMobile}
        onClose={handleMobileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: '45px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontFamily: 'League Spartan, sans-serif',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Navigation Links for Mobile */}
        <MenuItem
          component={RouterLink}
          to="/home"
          onClick={handleMobileMenuClose}
          sx={{
            fontFamily: 'League Spartan',
            color: isActive('/home') ? 'primary.main' : 'inherit',
          }}
        >
          Home
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to="/menu"
          onClick={handleMobileMenuClose}
          sx={{ fontFamily: 'League Spartan', color: isActive('/menu') ? 'primary.main' : 'inherit' }}
        >
          Menu
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to="/reservation"
          onClick={handleMobileMenuClose}
          sx={{ fontFamily: 'League Spartan', color: isActive('/reservation') ? 'primary.main' : 'inherit' }}
        >
          Reservation
        </MenuItem>
        {user && (
          <>
            <MenuItem
              component={RouterLink}
              to="/order"
              onClick={handleMobileMenuClose}
              sx={{ fontFamily: 'League Spartan' }}
            >
              Order
            </MenuItem>
            {(user.role === 'STAFF' || user.role === 'ADMIN') && (
              <MenuItem
                component={RouterLink}
                to="/dashboard"
                onClick={handleMobileMenuClose}
                sx={{ fontFamily: 'League Spartan' }}
              >
                Dashboard
              </MenuItem>
            )}
            {user.role === 'ADMIN' && (
              <MenuItem
                component={RouterLink}
                to="/admin"
                onClick={handleMobileMenuClose}
                sx={{ fontFamily: 'League Spartan' }}
              >
                Admin
              </MenuItem>
            )}
          </>
        )}
        {user ? (
          <MenuItem onClick={handleLogout} sx={{ fontFamily: 'League Spartan' }}>
            Logout
          </MenuItem>
        ) : (
          <MenuItem
            component={RouterLink}
            to="/login"
            onClick={handleMobileMenuClose}
            sx={{ fontFamily: 'League Spartan' }}
          >
            Login
          </MenuItem>
        )}
      </Menu>
    </AppBar>
  );
};

export default Navbar;
