// src/pages/EditOrder.tsx

import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  OrderDto,
  OrderCreateDto,
  MenuItemDto,
  ApiError,
  Role,
  Status,
} from '../types/Interfaces';
import { getOrderById, updateOrder, getAllMenuItems } from '../services/orderService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import menuItemBg from '../assets/images/burger.jpg';
import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent

interface OrderItemState {
  menuItem: MenuItemDto;
  quantity: number;
}

const EditOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItemState[]>([]);
  const [status, setStatus] = useState<Status>(Status.PENDING);
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    street: '',
    number: '',
    floor: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrderAndMenuItems = async () => {
      if (!orderId) {
        toast.error('No order ID provided.');
        navigate('/dashboard');
        return;
      }

      if (!user || !(user.role === Role.STAFF || user.role === Role.ADMIN)) {
        toast.error('Unauthorized access.');
        navigate('/dashboard');
        return;
      }

      try {
        // Fetch Order Details
        const fetchedOrder = await getOrderById(orderId);
        setOrder(fetchedOrder);
        setStatus(fetchedOrder.status);
        setDeliveryInfo({
          firstName: fetchedOrder.deliveryInfo.firstName,
          lastName: fetchedOrder.deliveryInfo.lastName,
          street: fetchedOrder.deliveryInfo.street,
          number: fetchedOrder.deliveryInfo.number,
          floor: fetchedOrder.deliveryInfo.floor ? fetchedOrder.deliveryInfo.floor.toString() : '',
          phoneNumber: fetchedOrder.deliveryInfo.phoneNumber,
        });

        // Fetch All Menu Items
        const fetchedMenuItems = await getAllMenuItems();
        setMenuItems(fetchedMenuItems);

        // Map Order Items to OrderItemState with explicit typing
        const mappedOrderItems: OrderItemState[] = fetchedOrder.orderItems.map((orderItem: any) => { // Explicitly type orderItem
          const menuItem = fetchedMenuItems.find((item: MenuItemDto) => item.id === orderItem.menuItemId);
          if (!menuItem) {
            console.warn(`Menu item with ID ${orderItem.menuItemId} not found.`);
          }
          return {
            menuItem: menuItem || {
              id: orderItem.menuItemId,
              name: 'Unknown Item',
              description: '',
              price: 0,
              category: '',
              menuId: null,
            },
            quantity: orderItem.quantity,
          };
        });

        setOrderItems(mappedOrderItems);
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

    fetchOrderAndMenuItems();
  }, [orderId, user, navigate]);

  const handleStatusChange = (e: SelectChangeEvent<Status>) => { // Use SelectChangeEvent
    setStatus(e.target.value as Status);
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
  };

  const handleOrderItemQuantityChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newOrderItems = [...orderItems];
    newOrderItems[index].quantity = parseInt(e.target.value) || 1;
    setOrderItems(newOrderItems);
  };

  const handleSubmit = async () => {
    if (!orderId || !order) { // Ensure orderId is defined
      toast.error('Order data is missing.');
      return;
    }

    setUpdating(true);

    try {
      // Prepare menuItemIdsAndQuantities
      const menuItemIdsAndQuantities: { [key: string]: number } = {};
      orderItems.forEach(item => {
        menuItemIdsAndQuantities[item.menuItem.id] = item.quantity;
      });

      // Prepare OrderCreateDto
      const updatedOrder: OrderCreateDto = {
        status: status,
        userId: order.userId,
        menuItemIdsAndQuantities: menuItemIdsAndQuantities,
        deliveryInfo: {
          firstName: deliveryInfo.firstName,
          lastName: deliveryInfo.lastName,
          street: deliveryInfo.street,
          number: deliveryInfo.number,
          floor: deliveryInfo.floor ? parseInt(deliveryInfo.floor) : null,
          phoneNumber: deliveryInfo.phoneNumber,
        },
      };

      console.log('Updated Order:', updatedOrder);

      // Send Update Request
      await updateOrder(orderId, updatedOrder); // Ensure updateOrder accepts OrderCreateDto
      toast.success('Order updated successfully!');
      navigate(`/orders/${orderId}`);
    } catch (err: any) {
      console.error('Update Order Error:', err);
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
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      >
        <Alert severity="error">
          <Typography variant="h6">{error.message}</Typography>
          {error.errors.map((errMsg, idx) => (
            <Typography key={idx} variant="body2">
              {errMsg}
            </Typography>
          ))}
        </Alert>
      </Box>
    );
  }

  if (!order) {
    return null;
  }

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
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
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
              Edit Order
            </Typography>

            {/* Edit Form */}
            <Box>
              {/* Status Selection */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="status-label" sx={{ color: '#ffffff' }}>
                  Status
                </InputLabel>
                <Select
                  labelId="status-label"
                  value={status}
                  label="Status"
                  onChange={handleStatusChange}
                  sx={{
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
                    '& .MuiSvgIcon-root': { color: '#ffffff' },
                  }}
                >
                  <MenuItem value={Status.COMPLETED}>COMPLETED</MenuItem>
                  <MenuItem value={Status.CANCELLED}>CANCELLED</MenuItem>
                  <MenuItem value={Status.PENDING}>PENDING</MenuItem>
                  <MenuItem value={Status.IN_PROGRESS}>IN_PROGRESS</MenuItem>
                </Select>
              </FormControl>

              {/* Delivery Information */}
              <Typography variant="h5" gutterBottom>
                Delivery Information
              </Typography>
              <Divider sx={{ mb: 2, backgroundColor: '#ffffff' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={deliveryInfo.firstName}
                    onChange={handleDeliveryChange}
                    fullWidth
                    required
                    InputLabelProps={{ style: { color: '#ffffff' } }}
                    InputProps={{
                      style: { color: '#ffffff', borderColor: '#ffffff' },
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#ffffff' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#ffffff' },
                        '&:hover fieldset': { borderColor: '#ffffff' },
                        '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={deliveryInfo.lastName}
                    onChange={handleDeliveryChange}
                    fullWidth
                    required
                    InputLabelProps={{ style: { color: '#ffffff' } }}
                    InputProps={{
                      style: { color: '#ffffff', borderColor: '#ffffff' },
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#ffffff' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#ffffff' },
                        '&:hover fieldset': { borderColor: '#ffffff' },
                        '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    label="Street"
                    name="street"
                    value={deliveryInfo.street}
                    onChange={handleDeliveryChange}
                    fullWidth
                    required
                    InputLabelProps={{ style: { color: '#ffffff' } }}
                    InputProps={{
                      style: { color: '#ffffff', borderColor: '#ffffff' },
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#ffffff' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#ffffff' },
                        '&:hover fieldset': { borderColor: '#ffffff' },
                        '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Number"
                    name="number"
                    value={deliveryInfo.number}
                    onChange={handleDeliveryChange}
                    fullWidth
                    required
                    type="number"
                    InputLabelProps={{ style: { color: '#ffffff' } }}
                    InputProps={{
                      style: { color: '#ffffff', borderColor: '#ffffff' },
                      inputProps: { min: 1 },
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#ffffff' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#ffffff' },
                        '&:hover fieldset': { borderColor: '#ffffff' },
                        '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Floor (Optional)"
                    name="floor"
                    value={deliveryInfo.floor}
                    onChange={handleDeliveryChange}
                    fullWidth
                    type="text"
                    InputLabelProps={{ style: { color: '#ffffff' } }}
                    InputProps={{
                      style: { color: '#ffffff', borderColor: '#ffffff' },
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#ffffff' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#ffffff' },
                        '&:hover fieldset': { borderColor: '#ffffff' },
                        '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={deliveryInfo.phoneNumber}
                    onChange={handleDeliveryChange}
                    fullWidth
                    required
                    type="tel"
                    InputLabelProps={{ style: { color: '#ffffff' } }}
                    InputProps={{
                      style: { color: '#ffffff', borderColor: '#ffffff' },
                      inputProps: { maxLength: 11 },
                    }}
                    helperText="Enter phone number (8-11 digits)"
                    sx={{
                      '& .MuiInputLabel-root': { color: '#ffffff' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#ffffff' },
                        '&:hover fieldset': { borderColor: '#ffffff' },
                        '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                      },
                      '& .MuiFormHelperText-root': { color: '#ffffff' },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Order Items */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Order Items
              </Typography>
              <Divider sx={{ mb: 2, backgroundColor: '#ffffff' }} />
              {orderItems.length === 0 ? (
                <Typography variant="body1">No items in the order.</Typography>
              ) : (
                <Grid container spacing={2}>
                  {orderItems.map((itemState, index) => (
                    <Grid item xs={12} key={itemState.menuItem.id}>
                      <Card sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px) brightness(0.5)' }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 100, height: 100, objectFit: 'cover' }}
                          image={menuItemBg} // Replace with actual image if available
                          alt={itemState.menuItem.name}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: 2 }}>
                          <Typography variant="h6" sx={{ color: '#ffffff' }}>
                            {itemState.menuItem.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#ffffff' }}>
                            {itemState.menuItem.description}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'primary.main', mt: 1 }}>
                            Price: ${itemState.menuItem.price.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ mr: 2 }}>
                          <TextField
                            label="Quantity"
                            type="number"
                            value={itemState.quantity}
                            onChange={(e) => handleOrderItemQuantityChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                            InputProps={{ inputProps: { min: 1 } }}
                            variant="outlined"
                            size="small"
                            sx={{
                              width: 100,
                              '& .MuiInputLabel-root': { color: '#ffffff' },
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#ffffff' },
                                '&:hover fieldset': { borderColor: '#ffffff' },
                                '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                              },
                              '& .MuiInputBase-input': { color: '#ffffff' },
                            }}
                          />
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>

            {/* Submit Button */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleSubmit}
                disabled={updating}
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
                {updating ? <CircularProgress size={24} color="inherit" /> : 'Update Order'}
              </Button>
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

export default EditOrder;
