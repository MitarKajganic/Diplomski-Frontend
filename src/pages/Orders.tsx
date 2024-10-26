import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { OrderDto, ApiError, OrderItemDto } from '../types/Interfaces';
import { getUserByEmail, getOrdersByUserId } from '../services/orderService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';

const Orders: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.email) {
        toast.error('User not authenticated.');
        navigate('/login');
        return;
      }

      try {
        const fetchedUser = await getUserByEmail(user.email);
        const userId = fetchedUser.id;
        const fetchedOrders = await getOrdersByUserId(userId);
        setOrders(fetchedOrders);
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

    fetchOrders();
  }, [user, navigate]);

  const calculateTotalPrice = (orderItems: OrderItemDto[]): number => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return <CheckCircleIcon color="success" />;
      case 'PENDING':
        return <HourglassEmptyIcon color="warning" />;
      case 'CANCELLED':
        return <CancelIcon color="error" />;
      default:
        return <HourglassEmptyIcon />;
    }
  };

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

  const handleViewDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#ffffff',
      }}
    >
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, mt: { xs: 10, sm: 12 }, p: { xs: 2, sm: 4 } }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                textAlign: 'center',
                fontFamily: 'League Spartan, sans-serif',
                color: 'primary.main',
                mb: 4,
              }}
            >
              Your Orders
            </Typography>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            )}

            {error && (
              <Box sx={{ mt: 4 }}>
                <Alert severity="error">
                  <Typography variant="h6">{error.message}</Typography>
                  {error.errors.map((err, idx) => (
                    <Typography key={idx} variant="body2">
                      {err}
                    </Typography>
                  ))}
                </Alert>
              </Box>
            )}

            {/* Orders List */}
            {!loading && !error && (
              <Grid container spacing={4}>
                {orders.length === 0 ? (
                  <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
                    You have no orders yet.
                  </Typography>
                ) : (
                  orders.map((order, index) => {
                    const totalPrice = calculateTotalPrice(order.orderItems);
                    const formattedDate = new Date(order.createdAt).toLocaleDateString();

                    return (
                      <Grid item xs={12} md={6} key={order.id}>
                        <motion.div
                          custom={index}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.3 }}
                          variants={cardVariants}
                        >
                          <Card
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(5px) brightness(0.5)',
                              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                              borderRadius: 2,
                              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                              },
                              padding: 2,
                            }}
                          >
                            <CardContent>
                              {/* Top Section: Total Price and Date */}
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <AttachMoneyIcon color="primary" />
                                <Typography
                                  variant="h6"
                                  sx={{ fontFamily: 'League Spartan, sans-serif', color: 'white' }}
                                >
                                  Total: ${(totalPrice * 1.2).toFixed(2)}
                                </Typography>
                              </Stack>
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                                <CalendarTodayIcon color="primary" />
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                  Date: {formattedDate}
                                </Typography>
                              </Stack>

                              {/* Status */}
                              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                                {getStatusIcon(order.status)}
                                <Typography variant="body1" sx={{ color: 'white' }}>
                                  {order.status}
                                </Typography>
                              </Stack>

                              {/* Total Items */}
                              <Typography variant="body1" sx={{ color: 'white', mt: 2 }}>
                                <strong>Total Items:</strong> {order.orderItems.length}
                              </Typography>

                              {/* View Details Button */}
                              <Box sx={{ mt: 3, textAlign: 'right' }}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleViewDetails(order.id)}
                                  sx={{
                                    fontFamily: 'League Spartan, sans-serif',
                                    textTransform: 'none',
                                    backgroundColor: '#D4AF37',
                                    color: '#000000',
                                    '&:hover': {
                                      backgroundColor: '#CDA434',
                                    },
                                  }}
                                >
                                  View Details
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    );
                  })
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

export default Orders;
