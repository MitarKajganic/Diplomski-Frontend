import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getTransactionBySessionId, getBillById } from '../services/orderService';
import { TransactionDto, BillDto, ApiError } from '../types/Interfaces';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const PaymentStatus: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleRedirect = async () => {
            const query = new URLSearchParams(location.search);
            const status = query.get('status');
            const sessionId = query.get('session_id');

            if (!status || !sessionId) {
                toast.error('Invalid payment status or session ID.');
                navigate('/home');
                return;
            }

            try {
                const transaction: TransactionDto = await getTransactionBySessionId(sessionId);

                if (!transaction) {
                    toast.error('Transaction not found.');
                    navigate('/home');
                    return;
                }

                const { billId } = transaction;

                if (!billId) {
                    toast.error('Bill information is missing.');
                    navigate('/home');
                    return;
                }

                const bill: BillDto = await getBillById(billId);

                if (!bill) {
                    toast.error('Bill not found.');
                    navigate('/home');
                    return;
                }

                const { orderId } = bill;

                if (!orderId) {
                    toast.error('Order information is missing.');
                    navigate('/home');
                    return;
                }

                if (status === 'success') {
                    if (transaction.stripeStatus === 'COMPLETED') {
                        navigate(`/orders/${orderId}`, { replace: true });
                    } else {
                        navigate(`/payment-failure/${orderId}`, { replace: true });
                    }
                } else if (status === 'cancel') {
                    navigate(`/order-cancel/${orderId}`, { replace: true });
                } else {
                    toast.error('Unknown payment status.');
                    navigate('/home');
                }
            } catch (error: any) {
                console.error('Error processing payment status:', error);
                if (error.response && error.response.data) {
                    const apiError: ApiError = error.response.data;
                    toast.error(apiError.message);
                } else {
                    toast.error('Failed to process payment status.');
                }
                navigate('/home');
            }
        };

        handleRedirect();
    }, [location.search, navigate]);

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
                }}
            >
                <CircularProgress color="primary" />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Processing your payment...
                </Typography>
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

export default PaymentStatus;
