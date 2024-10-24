// src/pages/Home.tsx
import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '@fontsource/pacifico/400.css';
import '@fontsource/league-spartan/400.css';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/menu');
    };

    // Animation variants for framer-motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } },
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: custom * 0.3, duration: 0.6 },
        }),
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh', // Ensures the container takes at least the full viewport height
                position: 'relative',
            }}
        >
            {/* Fixed Navbar */}
            <Navbar />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1 }}>
                <Container
                    maxWidth="lg"
                    sx={{
                        mt: { xs: 10, sm: 12 }, // Adjust top margin based on navbar height
                        mb: 4,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {/* Hero Section */}
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: 2,
                                backdropFilter: 'blur(5px)',
                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontFamily: 'Pacifico, cursive',
                                    fontWeight: 'normal',
                                    color: 'white',
                                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                                }}
                            >
                                Welcome to Our Restaurant
                            </Typography>
                            <Typography
                                variant="h5"
                                component="p"
                                gutterBottom
                                sx={{
                                    fontFamily: 'League Spartan, sans-serif',
                                    fontWeight: 400,
                                    color: 'white',
                                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                                    mb: 4,
                                }}
                            >
                                Experience the finest dining with us.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleGetStarted}
                                sx={{
                                    fontFamily: 'League Spartan, sans-serif',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    paddingX: 4,
                                    paddingY: 1.5,
                                    fontSize: '1rem',
                                    borderRadius: '25px',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                                    },
                                }}
                            >
                                Get Started
                            </Button>
                        </Box>

                        {/* Additional Sections */}
                        <Grid
                            container
                            spacing={4}
                            sx={{ mt: 8 }}
                            alignItems="stretch" // Ensures all Grid items stretch to the same height
                        >
                            {/* Section 1: Our Story */}
                            <Grid item xs={12} md={6}>
                                <motion.div
                                    custom={1}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={sectionVariants}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center', // Centers content vertically
                                            height: '100%', // Ensures the Box takes full height of Grid item
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: 2,
                                            padding: 3,
                                            backdropFilter: 'blur(5px)',
                                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                            minHeight: { xs: '200px', md: '250px' }, // Ensures a minimum height
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            component="h2"
                                            gutterBottom
                                            sx={{
                                                fontFamily: 'League Spartan, sans-serif',
                                                color: 'white',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Our Story
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontFamily: 'League Spartan, sans-serif',
                                                color: 'white',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            Our journey began with a passion for culinary excellence and a desire to create unforgettable dining experiences.
                                            From humble beginnings, we have grown into a beloved destination for food enthusiasts.
                                            Our commitment to quality, innovation, and hospitality has been the cornerstone of our success.
                                            Join us as we continue to write our story, one delicious dish at a time.
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </Grid>

                            {/* Section 2: Our Menu */}
                            <Grid item xs={12} md={6}>
                                <motion.div
                                    custom={2}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={sectionVariants}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center', // Centers content vertically
                                            height: '100%', // Ensures the Box takes full height of Grid item
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: 2,
                                            padding: 3,
                                            backdropFilter: 'blur(5px)',
                                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                            minHeight: { xs: '200px', md: '250px' }, // Ensures a minimum height
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            component="h2"
                                            gutterBottom
                                            sx={{
                                                fontFamily: 'League Spartan, sans-serif',
                                                color: 'white',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Our Menu
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontFamily: 'League Spartan, sans-serif',
                                                color: 'white',
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            Explore our diverse menu crafted by top chefs. From appetizers to desserts, we
                                            have something for every palate.
                                            Our dishes are prepared with the freshest ingredients, ensuring every bite is a burst of flavor.
                                            Whether you're in the mood for a classic favorite or an adventurous new dish, our menu has it all.
                                            Come and savor the taste of excellence.
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </motion.div>
                </Container>
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto', // Pushes the footer to the bottom
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

export default Home;
