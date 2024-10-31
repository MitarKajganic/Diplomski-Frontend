// src/pages/PaymentFailure.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';
import Navbar from '../components/Navbar';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PaymentFailure: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/home');
    };

    const handleBrowseProducts = () => {
        navigate('/menu'); // Adjust the path based on your routing structure
    };

    const handleContactSupport = () => {
        // Optionally, navigate to a contact support page or open a modal
        navigate('/home'); // Adjust the path based on your routing structure
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: '#ffffff',
            }}
        >
            <Navbar />
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                    px: 2,
                }}
            >
                <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Payment Failed
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Unfortunately, your payment was not successful. Your cart is now empty.
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Please try again or contact our support team if you need assistance.
                </Typography>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ mt: 4 }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBrowseProducts}
                    >
                        Browse Products
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleGoHome}
                    >
                        Go to Home
                    </Button>
                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={handleContactSupport}
                    >
                        Contact Support
                    </Button>
                </Stack>
            </Box>
            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <Typography variant="body2" sx={{ fontFamily: 'League Spartan, sans-serif' }}>
                    © {new Date().getFullYear()} RestaurantName. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
};

export default PaymentFailure;
