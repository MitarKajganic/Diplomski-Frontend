import React, { useState, useContext } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    CardMedia,
    Button,
    TextField,
    Divider,
    CircularProgress,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useCart, CartItem } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
    getUserByEmail,
    createOrder,
    createBill,
    createTransaction
} from '../services/orderService';
import {
    OrderCreateDto,
    OrderDto,
    BillDto,
    TransactionCreateDto,
    TransactionDto,
    Status,
    Method,
    Type,
    UserDto
} from '../types/Interfaces';
import menuItemBg from '../assets/images/burger.jpg';

const Checkout: React.FC = () => {
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [deliveryInfo, setDeliveryInfo] = useState({
        firstName: '',
        lastName: '',
        street: '',
        number: '',
        floor: '',
        phoneNumber: '',
    });

    const [paymentMethod, setPaymentMethod] = useState<'Card' | 'Cash'>('Card');

    const [loading, setLoading] = useState<boolean>(false);

    const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
    };

    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(e.target.value as 'Card' | 'Cash');
    };

    const validatePhoneNumber = (phone: string): boolean => {
        const regex = /^\d{8,11}$/;
        return regex.test(phone);
    };

    const handleCheckout = async () => {
        const { firstName, lastName, street, number, floor, phoneNumber } = deliveryInfo;

        if (
            !firstName ||
            !lastName ||
            !street ||
            !number ||
            !phoneNumber
        ) {
            toast.error('Please fill in all the required fields.');
            return;
        }

        if (!validatePhoneNumber(phoneNumber)) {
            toast.error('Please enter a valid phone number (8-11 digits).');
            return;
        }

        setLoading(true);

        try {
            if (!user || !user.email) {
                toast.error('User not authenticated.');
                navigate('/login');
                return;
            }

            const fetchedUser: UserDto = await getUserByEmail(user.email);
            const userId = fetchedUser.id;

            const menuItemIdsAndQuantities: { [key: string]: number } = {};
            cartItems.forEach((item: CartItem) => {
                menuItemIdsAndQuantities[item.id] = item.quantity;
            });

            const orderPayload: OrderCreateDto = {
                status: Status.PENDING,
                userId: userId,
                menuItemIdsAndQuantities: menuItemIdsAndQuantities,
                deliveryInfo: {
                    firstName,
                    lastName,
                    street,
                    number,
                    floor: floor ? parseInt(floor) : null,
                    phoneNumber,
                },
            };

            const order: OrderDto = await createOrder(orderPayload);
            toast.success('Order created successfully!');

            const bill: BillDto = await createBill(order.id);
            toast.success('Bill created successfully!');

            const updatedOrder: OrderDto = { ...order, billId: bill.id };

            const transactionPayload: TransactionCreateDto = {
                amount: bill.finalAmount,
                type: Type.PAYMENT,
                method: paymentMethod === 'Card' ? Method.CARD : Method.CASH,
                billId: bill.id,
            };

            const transaction: TransactionDto = await createTransaction(transactionPayload);
            toast.success('Transaction recorded successfully!');

            console.log('Order:', updatedOrder);
            console.log('Bill:', bill);
            console.log('Transaction:', transaction);

            clearCart();

            if (paymentMethod === 'Card' && transaction.stripeUrl) {
                window.location.href = transaction.stripeUrl;
            } else {
                navigate(`/orders/${order.id}`, { state: { order: updatedOrder, bill, transaction } });
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error('An error occurred during checkout. Please try again.');
        } finally {
            setLoading(false);
        }
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
                            Checkout
                        </Typography>

                        {/* Order Summary */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                Order Summary
                            </Typography>
                            <Divider sx={{ mb: 2, backgroundColor: '#ffffff' }} />
                            {cartItems.length === 0 ? (
                                <Typography variant="body1">Your cart is empty.</Typography>
                            ) : (
                                <Grid container spacing={2}>
                                    {cartItems.map((item: CartItem) => (
                                        <Grid item xs={12} key={item.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CardMedia
                                                    component="img"
                                                    image={menuItemBg}
                                                    alt={item.name}
                                                    sx={{ width: 60, height: 60, mr: 2, borderRadius: 1 }}
                                                />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle1">{item.name}</Typography>
                                                    <Typography variant="body2">
                                                        Quantity: {item.quantity}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="subtitle1">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                    <Grid item xs={12}>
                                        <Divider sx={{ mt: 2, mb: 2, backgroundColor: '#ffffff' }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="h6">Total:</Typography>
                                            <Typography variant="h6">${(getTotalPrice() * 1.2).toFixed(2)}</Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            )}
                        </Box>

                        {/* Delivery Information */}
                        <Box sx={{ mb: 4 }}>
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

                        {/* Payment Method Selection */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                Payment Method
                            </Typography>
                            <Divider sx={{ mb: 2, backgroundColor: '#ffffff' }} />
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Choose a payment method</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="payment-method"
                                    name="paymentMethod"
                                    value={paymentMethod}
                                    onChange={handlePaymentMethodChange}
                                >
                                    <FormControlLabel value="Card" control={<Radio />} label="Card" />
                                    <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        {/* Confirm Purchase Button */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0 || loading}
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
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Purchase'}
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
}

export default Checkout;
