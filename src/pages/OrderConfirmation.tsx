// src/pages/OrderConfirmation.tsx
import React from 'react';
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
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { OrderDto, OrderItemDto, BillDto, TransactionDto } from '../types/Interfaces';

interface LocationState {
    order: OrderDto;
    bill: BillDto;
    transaction: TransactionDto;
}

const OrderConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract order, bill, and transaction from navigation state
    const { order, bill, transaction } = (location.state as LocationState) || {};

    if (!order || !bill || !transaction) {
        // If no order, bill, or transaction data, redirect to home or handle accordingly
        navigate('/home');
        return null;
    }

    const handleReturnHome = () => {
        navigate('/home');
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
                                        Total Amount:
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
                                                secondary={`Price per Unit: $${(item.price / item.quantity).toFixed(2)} | Subtotal: $${item.price.toFixed(2)}`}
                                                secondaryTypographyProps={{ color: '#ffffff' }} // Set to desired color
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
                                            Created At:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1">
                                            {new Date(transaction.transactionTime).toLocaleString()}

                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>

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
