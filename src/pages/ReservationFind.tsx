import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
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
import {
  getReservationsByGuestName,
  getReservationsByGuestEmail,
  getReservationsByGuestPhone,
  getTableByTableId,
} from '../services/reservationService';
import { ReservationDto, TableDto } from '../types/Interfaces';
import EventNoteIcon from '@mui/icons-material/EventNote';

const ReservationFind: React.FC = () => {
  const navigate = useNavigate();

  const [searchType, setSearchType] = useState<'name' | 'email' | 'phone'>('name');
  const [searchValue, setSearchValue] = useState<string>('');
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tableDetails, setTableDetails] = useState<{ [key: string]: TableDto }>({});

  const handleSearchTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchType(event.target.value as 'name' | 'email' | 'phone');
    setSearchValue('');
    setReservations([]);
    setError(null);
  };

  const handleSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchValue(event.target.value);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchValue.trim()) {
      setError('Please enter a value to search.');
      setReservations([]);
      return;
    }

    setLoading(true);
    setError(null);
    setReservations([]);

    try {
      let fetchedReservations: ReservationDto[] = [];

      switch (searchType) {
        case 'name':
          fetchedReservations = await getReservationsByGuestName(searchValue.trim());
          break;
        case 'email':
          fetchedReservations = await getReservationsByGuestEmail(searchValue.trim());
          break;
        case 'phone':
          fetchedReservations = await getReservationsByGuestPhone(searchValue.trim());
          break;
        default:
          throw new Error('Invalid search type.');
      }

      if (fetchedReservations.length === 0) {
        setError('No reservations found for the provided information.');
      } else {
        setReservations(fetchedReservations);

        const tableDetailsPromises = fetchedReservations.map(async (reservation) => {
          const table = await getTableByTableId(reservation.tableId);
          return { [reservation.tableId]: table };
        });

        const tableDetailsArray = await Promise.all(tableDetailsPromises);
        const tableDetailsObject = Object.assign({}, ...tableDetailsArray);
        setTableDetails(tableDetailsObject);
      }
    } catch (err: any) {
      console.error('Error fetching reservations:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewReservation = (reservationId: string) => {
    navigate(`/reservations/${reservationId}`);
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
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
              Find Your Reservation
            </Typography>

            {/* Search Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              {/* Search Type Selection */}
              <RadioGroup
                row
                value={searchType}
                onChange={handleSearchTypeChange}
                aria-label="search type"
                name="search-type"
              >
                <FormControlLabel
                  value="name"
                  control={<Radio />}
                  label="Name"
                />
                <FormControlLabel
                  value="email"
                  control={<Radio />}
                  label="Email"
                />
                <FormControlLabel
                  value="phone"
                  control={<Radio />}
                  label="Phone Number"
                />
              </RadioGroup>

              {/* Search Input */}
              <TextField
                label={
                  searchType === 'name'
                    ? 'Guest Name'
                    : searchType === 'email'
                    ? 'Guest Email'
                    : 'Guest Phone Number'
                }
                variant="outlined"
                fullWidth
                value={searchValue}
                onChange={handleSearchValueChange}
                required
                InputLabelProps={{
                  style: { color: 'white' },
                }}
                InputProps={{
                  style: { color: 'white' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{
                  height: '50px',
                  fontFamily: 'League Spartan, sans-serif',
                  fontSize: '1rem',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
              </Button>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}

            {/* Search Results */}
            {reservations.length > 0 && (
              <Box sx={{ mt: 5 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{
                    textAlign: 'center',
                    fontFamily: 'League Spartan, sans-serif',
                    color: 'primary.main',
                    mb: 3,
                  }}
                >
                  Search Results
                </Typography>
                <Grid container spacing={3}>
                  {reservations.map((reservation) => (
                    <Grid item xs={12} sm={6} md={4} key={reservation.id}>
                      <Card
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                          backdropFilter: 'blur(10px)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <CardContent>
                          {/* Date & Time */}
                          <Typography variant="h6" gutterBottom>
                            {new Date(reservation.reservationTime).toLocaleString()}
                          </Typography>

                          {/* Reservation ID */}
                          <Typography variant="body2">
                            <strong>ID:</strong> {reservation.id}
                          </Typography>

                          {/* Number of Guests */}
                          <Typography variant="body2">
                            <strong>Guests:</strong> {reservation.numberOfGuests}
                          </Typography>

                          {/* Table Number */}
                          <Typography variant="body2">
                            <strong>Table:</strong> {tableDetails[reservation.tableId]?.tableNumber || 'Loading...'}
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
              </Box>
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

export default ReservationFind;