import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { getReservationsByUserId, getAllTables } from '../services/reservationService';
import { ReservationDto, TableDto, ApiError } from '../types/Interfaces';
import { AuthContext } from '../context/AuthContext';
import EventNoteIcon from '@mui/icons-material/EventNote';

interface EnhancedReservation extends ReservationDto {
  tableNumber: number;
  tableCapacity: number;
}

const UserReservations: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState<EnhancedReservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [tablesMap, setTablesMap] = useState<Map<string, TableDto>>(new Map());

  useEffect(() => {
    const fetchUserReservations = async () => {
      if (!user) {
        setError({
          status: 401,
          message: 'Unauthorized',
          errors: ['You must be logged in to view your reservations.'],
        });
        setLoading(false);
        return;
      }

      try {
        const allTables = await getAllTables();
        const map = new Map<string, TableDto>();
        allTables.forEach((table) => map.set(table.id, table));
        setTablesMap(map);

        const fetchedReservations = await getReservationsByUserId(user.id);

        const enhancedReservations: EnhancedReservation[] = fetchedReservations.map((reservation) => {
          const table = map.get(reservation.tableId);
          return {
            ...reservation,
            tableNumber: table ? table.tableNumber : 0,
            tableCapacity: table ? table.capacity : 0,
          };
        });

        enhancedReservations.sort(
          (a, b) => new Date(b.reservationTime).getTime() - new Date(a.reservationTime).getTime()
        );

        setReservations(enhancedReservations);
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

    fetchUserReservations();
  }, [user]);

  const handleViewReservation = (reservationId: string) => {
    navigate(`/reservations/${reservationId}`);
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
            paddingX: 2,
          }}
        >
          <Alert severity="error" sx={{ width: '80%', maxWidth: 600 }}>
            <Typography variant="h6">{error.message}</Typography>
            {error.errors.map((errMsg, idx) => (
              <Typography key={idx} variant="body2">
                {errMsg}
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
              My Reservations
            </Typography>

            {reservations.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                You have no reservations at the moment.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {reservations.map((reservation) => (
                  <Grid item xs={12} sm={6} md={4} key={reservation.id}>
                    <Card
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <CardContent>
                        {/* Date & Time at the Top */}
                        <Typography variant="h6" gutterBottom>
                          {new Date(reservation.reservationTime).toLocaleString()}
                        </Typography>

                        {/* Reservation ID */}
                        <Typography variant="body2">
                          <strong>Reservation ID:</strong> {reservation.id}
                        </Typography>

                        {/* Number of Guests */}
                        <Typography variant="body2">
                          <strong>Guests:</strong> {reservation.numberOfGuests}
                        </Typography>

                        {/* Table Number */}
                        <Typography variant="body2">
                          <strong>Table:</strong> {`Table ${reservation.tableNumber}`}
                        </Typography>

                        {/* Table Capacity */}
                        <Typography variant="body2">
                          <strong>Table Capacity:</strong> {reservation.tableCapacity}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          startIcon={<EventNoteIcon />}
                          onClick={() => handleViewReservation(reservation.id)}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
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

export default UserReservations;
