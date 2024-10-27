import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import {
  OrderDto,
  OrderItemDto,
  BillDto,
  TransactionDto,
  ApiError
} from '../types/Interfaces';
import {
  getOrderById,
  getBillById,
  getTransactionsByBillId,
} from '../services/orderService';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from '../context/AuthContext';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [bill, setBill] = useState<BillDto | null>(null);
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const { user } = useContext(AuthContext); 

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        toast.error('No order ID provided.');
        navigate('/orders');
        return;
      }

      try {
        const fetchedOrder = await getOrderById(orderId);
        setOrder(fetchedOrder);

        if (fetchedOrder.billId) {
          const fetchedBill = await getBillById(fetchedOrder.billId);
          setBill(fetchedBill);

          const fetchedTransactions = await getTransactionsByBillId(fetchedBill.id);
          setTransactions(fetchedTransactions);
        } else {
          setError({
            status: 404,
            message: 'Bill not found for this order.',
            errors: ['Bill information is missing.'],
          });
        }
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

    fetchOrderDetails();
  }, [orderId, navigate]);

  const handleReturnHome = () => {
    navigate('/home');
  };

  if (loading) {
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

        {/* Loading Indicator */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress color="primary" />
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
  }

  if (error) {
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

        {/* Error Message */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Alert severity="error" sx={{ width: '80%', maxWidth: 600 }}>
            <Typography variant="h6">{error.message}</Typography>
            {error.errors.map((err, idx) => (
              <Typography key={idx} variant="body2">
                {err}
              </Typography>
            ))}
          </Alert>
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
  }

  if (!order || !bill) {
    return null;
  }

  const handleEditOrder = (orderId: string) => {
    navigate(`/orders/${orderId}/edit`);
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
      <Box sx={{ flexGrow: 1, mt: { xs: 10, sm: 12 }, p: { xs: 2, sm: 4 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontFamily: 'League Spartan, sans-serif',
                color: 'primary.main',
                mb: 4,
              }}
            >
              Thank You for Your Purchase!
            </Typography>

            <Typography variant="h6" gutterBottom>
              Your order has been successfully placed.
            </Typography>
            <Typography variant="body1" gutterBottom>
              You will receive an email confirmation shortly.
            </Typography>

            {/* Order Details */}
            <Box sx={{ mt: 4, textAlign: 'left' }}>
              <Typography variant="h5" gutterBottom>
                Order Details
              </Typography>
              <Divider sx={{ mb: 2, backgroundColor: '#ffffff' }} />
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Order ID:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">{order.id}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Status:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">{order.status}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Created At:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>

              {/* Delivery Information */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Delivery Information
                </Typography>
                <Divider sx={{ mb: 2, backgroundColor: '#ffffff' }} />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      First Name:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">{order.deliveryInfo.firstName}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Last Name:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">{order.deliveryInfo.lastName}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Address:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">
                      {order.deliveryInfo.street} {order.deliveryInfo.number}
                      {order.deliveryInfo.floor ? `, Floor ${order.deliveryInfo.floor}` : ''}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Phone Number:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">{order.deliveryInfo.phoneNumber}</Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Ordered Items */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Ordered Items
                </Typography>
                <Divider sx={{ mb: 2, backgroundColor: '#ffffff' }} />
                <List>
                  {order.orderItems.map((item: OrderItemDto) => (
                    <ListItem key={item.id}>
                      <ListItemText
                        primary={`${item.quantity} x ${item.name}`}
                        secondary={`Price per Unit: $${(item.price / item.quantity).toFixed(
                          2
                        )} | Subtotal: $${item.price.toFixed(2)}`}
                        secondaryTypographyProps={{ color: '#ffffff' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Bill Details */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Bill Details
                </Typography>
                <Divider sx={{ mb: 2, backgroundColor: '#ffffff' }} />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Total Amount:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">${bill.totalAmount.toFixed(2)}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Tax:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">${(bill.tax * bill.totalAmount).toFixed(2)}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Final Amount:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">${bill.finalAmount.toFixed(2)}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Created At:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">
                      {new Date(bill.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Transaction Details */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Transaction Details
                </Typography>
                <Divider sx={{ mb: 2, backgroundColor: '#ffffff' }} />
                <Grid container spacing={1}>
                  {transactions.map((transaction: TransactionDto) => (
                    <React.Fragment key={transaction.id}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Transaction ID:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">{transaction.id}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Type:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">{transaction.type}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Method:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">{transaction.method}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Amount:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">${transaction.amount.toFixed(2)}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Transaction Time:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          {new Date(transaction.transactionTime).toLocaleString()}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 2, backgroundColor: '#ffffff' }} />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </Box>

              {/* Conditional Edit Button */}
            {(user?.role === 'STAFF' || user?.role === 'ADMIN') && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditOrder(order.id)}
                  sx={{
                    fontFamily: 'League Spartan, sans-serif',
                    textTransform: 'none',
                  }}
                >
                  Edit Order
                </Button>
              </Box>
            )}

              {/* Return to Home Button */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReturnHome}
                  sx={{
                    fontFamily: 'League Spartan, sans-serif',
                    textTransform: 'none',
                    backgroundColor: '#D4AF37',
                    color: '#000000',
                    paddingX: 4,
                    paddingY: 1.5,
                    '&:hover': {
                      backgroundColor: '#CDA434',
                    },
                  }}
                >
                  Return to Home
                </Button>
              </Box>
            </Box>
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

export default OrderConfirmation;
