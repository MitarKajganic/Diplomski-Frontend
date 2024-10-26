// src/pages/ReservationConfirmation.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ReservationDto,
  TableDto,
  ApiError,
} from '../types/Interfaces';
import {
  getReservationById,
  getTablesFloor1,
} from '../services/reservationService';
import { toast } from 'react-toastify';

const ReservationConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { reservationId } = useParams<{ reservationId: string }>();

  const [reservation, setReservation] = useState<ReservationDto | null>(null);
  const [reservedTables, setReservedTables] = useState<TableDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (!reservationId) {
        toast.error('No reservation ID provided.');
        navigate('/reservations');
        return;
      }

      try {
        // Fetch Reservation Details
        const fetchedReservation = await getReservationById(reservationId);
        setReservation(fetchedReservation);

        // Fetch Table Details
        const fetchedTables = await getTablesFloor1(); // Since we're using Floor 1
        const table = fetchedTables.find((t) => t.id === fetchedReservation.tableId);
        if (table) {
          setReservedTables([table]);
        } else {
          setReservedTables([]);
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

    fetchReservationDetails();
  }, [reservationId, navigate]);

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
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
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
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
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

  if (!reservation || reservedTables.length === 0) {
    return null; // Prevent rendering if data is incomplete
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
              Reservation Confirmed!
            </Typography>

            <Typography variant="h6" gutterBottom>
              Thank you for your reservation.
            </Typography>
            <Typography variant="body1" gutterBottom>
              You will receive an email confirmation shortly.
            </Typography>

            {/* Reservation Details */}
            <Box sx={{ mt: 4, textAlign: 'left' }}>
              <Typography variant="h5" gutterBottom>
                Reservation Details
              </Typography>
              <Divider sx={{ mb: 2, backgroundColor: '#ffffff' }} />
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Reservation ID:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">{reservation.id}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Reserved At:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    {new Date(reservation.reservationTime).toLocaleString()}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Number of Guests:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">{reservation.numberOfGuests}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Table Number:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    {reservedTables.map((table) => `Table ${table.tableNumber}`).join(', ')}
                  </Typography>
                </Grid>

                {/* Add more reservation details as needed */}
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

export default ReservationConfirmation;
