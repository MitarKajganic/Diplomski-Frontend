import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { MenuDto, MenuItemDto, ApiError } from '../types/Interfaces';
import { getMenus } from '../services/menuService';
import menuItemBg from '../assets/images/burger.jpg';
import '@fontsource/league-spartan/400.css';
import '@fontsource/league-spartan/700.css';
import '@fontsource/pacifico/400.css';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Menu: React.FC = () => {
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await getMenus();
        setMenus(data);
        setSelectedMenuIndex(0);
      } catch (err: any) {
        if (err.response && err.response.data) {
          setError(err.response.data as ApiError);
        } else if (err instanceof Error) {
          setError({
            status: 500,
            message: err.message,
            errors: [err.message],
          });
        } else {
          setError({
            status: 500,
            message: 'An unknown error occurred.',
            errors: ['Unknown error'],
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.6 },
    }),
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedMenuIndex(newValue);
  };

  const handleAddToCart = (item: MenuItemDto) => {
    if (user) {
      addToCart(item);
      toast.success(`${item.name} added to cart`);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: location } });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, mt: { xs: 10, sm: 12 } }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                textAlign: 'center',
                fontFamily: 'League Spartan, sans-serif',
                color: 'primary.main',
                mt: 4,
                mb: 2,
              }}
            >
              Our Menu
            </Typography>

            {/* Tabs for Menus */}
            {menus.length > 0 && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
                <Tabs
                  value={selectedMenuIndex}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  aria-label="menu tabs"
                  sx={{
                    '& .MuiTabs-indicator': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                >
                  {menus.map((menu, index) => (
                    <Tab
                      key={menu.id}
                      label={menu.name}
                      sx={{
                        fontFamily: 'League Spartan, sans-serif',
                        fontWeight: 'normal',
                        textTransform: 'none',
                        paddingY: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        color: selectedMenuIndex === index ? 'primary.main' : 'inherit',
                        '&.Mui-selected': {
                          color: 'primary.main',
                          fontWeight: 'bold',
                        },
                        transition: 'color 0.3s ease, padding 0.3s ease',
                      }}
                    />
                  ))}
                </Tabs>
              </Box>
            )}

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            )}

            {error && (
              <Box sx={{ mt: 4 }}>
                <Alert severity="error">
                  {error.message}
                  {error.errors.map((err, idx) => (
                    <Typography key={idx} variant="body2">
                      {err}
                    </Typography>
                  ))}
                </Alert>
              </Box>
            )}

            {/* Display Menu Items */}
            {!loading && !error && menus.length > 0 && (
              <Grid container spacing={4} sx={{ mt: 2 }}>
                {menus[selectedMenuIndex].items && menus[selectedMenuIndex].items.length > 0 ? (
                  menus[selectedMenuIndex].items.map((item: MenuItemDto, index: number) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <motion.div
                        custom={index}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={cardVariants}
                      >
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(5px) brightness(0.5)',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            borderRadius: 2,
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                            },
                          }}
                        >
                          {/* Replace with actual image URL if available */}
                          <CardMedia
                            component="img"
                            height="160"
                            image={menuItemBg}
                            alt={item.name}
                            loading="lazy"
                          />
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                              sx={{
                                fontFamily: 'League Spartan, sans-serif',
                                color: 'white',
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontFamily: 'League Spartan, sans-serif',
                                color: 'white',
                                mb: 1,
                              }}
                            >
                              {item.description}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                fontFamily: 'League Spartan, sans-serif',
                                color: 'primary.main',
                              }}
                            >
                              ${item.price.toFixed(2)}
                            </Typography>

                            {/* Conditional Rendering of Add to Cart or Login to Order */}
                            {user ? (
                              <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2, fontFamily: 'League Spartan, sans-serif' }}
                                onClick={() => handleAddToCart(item)}
                              >
                                Add to Cart
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2, fontFamily: 'League Spartan, sans-serif' }}
                                onClick={handleLoginRedirect}
                              >
                                Login to Order
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      component="p"
                      sx={{
                        textAlign: 'center',
                        fontFamily: 'League Spartan, sans-serif',
                        color: 'white',
                      }}
                    >
                      No items available for this menu.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </motion.div>
        </Container>
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

export default Menu;
