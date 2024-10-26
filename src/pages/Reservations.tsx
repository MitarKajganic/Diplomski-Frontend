// src/pages/Reservations.tsx

import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import floorPlan from '../assets/images/floor-plan-1.png';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';
import {
  getTablesFloor1,
  createReservation,
} from '../services/reservationService';
import { TableDto, ReservationCreateDto } from '../types/Interfaces';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Tooltip from '@mui/material/Tooltip';
import { addDays, setHours, setMinutes } from 'date-fns'; // Import necessary functions

// Styled TableButton Component with Responsive Font Size
const TableButton = styled(Button)<{
  top: string;
  left: string;
  width: string;
  height: string;
  selected: boolean;
}>(({ top, left, width, height, theme }) => ({
  position: 'absolute',
  top: top,
  left: left,
  width: width,
  height: height,
  minWidth: 0,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#fff',
  fontWeight: 'normal',
  fontFamily: 'League Spartan, sans-serif',
  transition: 'background-color 0.3s, border-color 0.3s',
  // Responsive font sizes using theme breakpoints
  fontSize: '2rem', // Default for mobile
  [theme.breakpoints.up('sm')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '3rem',
  },
}));

const Reservations: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [tables, setTables] = useState<TableDto[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reservationLoading, setReservationLoading] = useState<boolean>(false);

  // Form state
  const [reservationTime, setReservationTime] = useState<Date | null>(
    setHours(setMinutes(addDays(new Date(), 1), 0), 10) // Initialize to tomorrow at 10:00 AM
  );
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');

  // Fetch tables on Floor 1
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const fetchedTables = await getTablesFloor1();
        console.log(fetchedTables);
        setTables(fetchedTables);
      } catch (err) {
        console.error('Error fetching tables:', err);
        setError('Failed to load tables. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  // Handler for table click
  const handleTableClick = (table: TableDto) => {
    if (table.reservations && table.reservations.length > 0) {
      toast.error(`Table ${table.tableNumber} is already reserved.`);
      return;
    }

    if (selectedTable === table.id) {
      setSelectedTable(null);
      toast.info(`Table ${table.tableNumber} deselected.`);
    } else {
      setSelectedTable(table.id);
      toast.success(`Table ${table.tableNumber} selected.`);
    }
  };

  // Helper function to validate reservation time
  const isValidReservationTime = (date: Date): boolean => {
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Check if time is between 10:00 AM and 7:30 PM
    if (hour < 10 || (hour === 19 && minute > 30) || hour > 19) {
      return false;
    }
    return true;
  };

  // Handler for confirming reservation
  const handleConfirmReservation = async () => {
    if (!selectedTable) {
      toast.error('Please select a table.');
      return;
    }

    if (!reservationTime) {
      toast.error('Please select a reservation time.');
      return;
    }

    if (numberOfGuests < 1) {
      toast.error('Number of guests must be at least 1.');
      return;
    }

    if (!user) {
      if (!guestName || !guestEmail || !guestPhone) {
        toast.error('Please fill out all guest details.');
        return;
      }
      // Add additional validation as needed (e.g., email format, phone number)
    }

    // Validate reservation time
    if (!isValidReservationTime(reservationTime)) {
      toast.error('Please select a time between 10:00 AM and 7:30 PM.');
      return;
    }

    setReservationLoading(true);

    try {
      // Prepare reservation data
      const reservationData: ReservationCreateDto = {
        tableId: selectedTable,
        reservationTime: new Date(reservationTime.getTime() + 60 * 60 * 1000).toISOString(), // Add 1 hour
        numberOfGuests: numberOfGuests,
        userId: user ? user.id : undefined,
        guestName: user ? undefined : guestName,
        guestEmail: user ? undefined : guestEmail,
        guestPhone: user ? undefined : guestPhone,
      };

      console.log('Reservation Data:', reservationData);

      // Send reservation request
      const reservation = await createReservation(reservationData);

      console.log(reservationData);

      toast.success('Reservation confirmed successfully!');

      // Navigate to a confirmation page with reservation details
      navigate(`/reservations/${reservation.id}`); // Modify as needed

      // Reset selections and form inputs
      setSelectedTable(null);
      setReservationTime(setHours(setMinutes(addDays(new Date(), 1), 0), 10)); // Reset to tomorrow at 10:00 AM
      setNumberOfGuests(1);
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
    } catch (err) {
      console.error('Reservation error:', err);
      toast.error('Failed to confirm reservation. Please try again.');
    } finally {
      setReservationLoading(false);
    }
  };

  // Common styles for TextFields to have white text and labels
  const textFieldStyles = {
    mb: 2,
    '& .MuiInputBase-input': { color: 'white' },
    '& .MuiInputLabel-root': { color: 'white' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
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
            {error}
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
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
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
                mb: 2,
              }}
            >
              Make a Reservation
            </Typography>

            {/* Informational Subtext */}
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                fontFamily: 'League Spartan, sans-serif',
                color: 'white', // Corrected color
                mb: 4,
              }}
            >
              Our working hours are from 10:00 AM to 7:30 PM. Please make your reservations at least one day in advance.
            </Typography>

            {/* Reservation Form */}
            <Box sx={{ mb: 4 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Reservation Time"
                  value={reservationTime}
                  onChange={(newValue: Date | null) => setReservationTime(newValue)}
                  minDate={addDays(new Date(), 1)} // Set minimum date to tomorrow
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        ...textFieldStyles,
                        '& .MuiSvgIcon-root': {
                          color: 'white', // Change icon color to white
                        },
                      },
                    },
                    dialog: {
                      PaperProps: {
                        sx: {
                          backgroundColor: 'rgba(64, 64, 64, 1)', // Match theme's paper color
                          color: '#ffffff', // Set all text in popover to white
                          // Additional styles to ensure all nested text is white
                          '& .MuiTypography-root': {
                            color: '#ffffff',
                          },
                          '& .MuiPickersDay-root': {
                            color: '#ffffff',
                          },
                          '& .MuiPickersDay-root.Mui-selected': {
                            color: '#000000', // Black text on selected day for contrast
                          },
                          '& .MuiClockPointer-pointer': {
                            backgroundColor: '#ffffff', // White pointer
                          },
                          '& .MuiClockPointer-thumb': {
                            backgroundColor: '#ffffff', // White thumb
                          },
                          '& .MuiClock-face': {
                            color: '#ffffff', // White clock face
                          },
                          '& .MuiPickersToolbar-toolbar': {
                            backgroundColor: 'rgba(64, 64, 64, 1)', // Match paper background
                            color: '#ffffff',
                          },
                          '& .MuiPickersCalendarHeader-label': {
                            color: '#ffffff',
                          },
                          '& .MuiIconButton-root': {
                            color: '#ffffff',
                          },
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
              <TextField
                label="Number of Guests"
                type="number"
                value={numberOfGuests}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumberOfGuests(Number(e.target.value))}
                fullWidth
                sx={textFieldStyles}
                inputProps={{ min: 1 }}
              />
              {!user && (
                <>
                  <TextField
                    label="Guest Name"
                    value={guestName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGuestName(e.target.value)}
                    fullWidth
                    sx={textFieldStyles}
                  />
                  <TextField
                    label="Guest Email"
                    type="email"
                    value={guestEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGuestEmail(e.target.value)}
                    fullWidth
                    sx={textFieldStyles}
                  />
                  <TextField
                    label="Guest Phone"
                    type="tel"
                    value={guestPhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGuestPhone(e.target.value)}
                    fullWidth
                    sx={textFieldStyles}
                  />
                </>
              )}
            </Box>

            {/* Floor Plan Container */}
            <Box
              sx={{
                position: 'relative',
                width: '80%', // Adjusted width
                maxWidth: '800px', // Maximum width
                margin: '0 auto', // Center the container
                borderRadius: 2,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden', // Ensures table buttons don't overflow the container
              }}
            >
              <Box
                component="img"
                src={floorPlan}
                alt="Floor Plan"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
              {/* Render Table Buttons */}
              {tables.map((table) => (
                <Tooltip
                  key={table.id}
                  title={
                    table.reservations && table.reservations.length > 0
                      ? `Reserved by ${table.reservations[0].guestName || 'User'}`
                      : 'Available'
                  }
                  arrow
                  placement="top"
                >
                  <span>
                    {/* Wrapping in span to handle disabled buttons with Tooltip */}
                    <TableButton
                      onClick={() => handleTableClick(table)}
                      top={getTablePosition(table).top}
                      left={getTablePosition(table).left}
                      width={getTablePosition(table).width}
                      height={getTablePosition(table).height}
                      selected={selectedTable === table.id}
                      aria-label={`Table ${table.tableNumber}`}
                      aria-pressed={selectedTable === table.id}
                      disabled={table.reservations && table.reservations.length > 0}
                      sx={{
                        backgroundColor:
                          table.reservations && table.reservations.length > 0
                            ? 'rgba(128, 128, 128, 1)' // Solid Gray for reserved
                            : selectedTable === table.id
                            ? 'rgba(255, 0, 0, 1)' // Solid Red if selected
                            : [1, 2, 3, 4].includes(table.tableNumber)
                            ? 'rgba(0, 0, 0, 1)' // Solid Black for tables 1-4
                            : 'transparent',
                        border:
                          table.reservations && table.reservations.length > 0
                            ? '2px solid rgba(128, 128, 128, 1)' // Solid Gray border if reserved
                            : [1, 2, 3, 4].includes(table.tableNumber)
                            ? '2px solid rgba(0, 0, 0, 1)' // Solid Black border for tables 1-4
                            : '2px solid rgba(255, 255, 255, 0.5)', // White border otherwise
                        zIndex: 1, // Ensure buttons are above the image
                      }}
                    >
                      {table.tableNumber}
                    </TableButton>
                  </span>
                </Tooltip>
              ))}
            </Box>

            {/* Selected Tables Info and Confirm Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h6">
                Selected Table:{' '}
                {selectedTable
                  ? `Table ${
                      tables.find((t) => t.id === selectedTable)?.tableNumber || ''
                    }`
                  : 'None'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  backgroundColor: '#D4AF37',
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: '#CDA434',
                  },
                }}
                onClick={handleConfirmReservation}
                disabled={reservationLoading || !selectedTable}
              >
                {reservationLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Reservation'}
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

// Utility function to determine table position based on floor
const getTablePosition = (table: TableDto) => {
  if (table.tableNumber >= 1 && table.tableNumber <= 4) {
    const floor1Positions: {
      [key: number]: { top: string; left: string; width: string; height: string };
    } = {
      1: { top: '34.5%', left: '48.6%', width: '13%', height: '22%' },
      2: { top: '34.5%', left: '66.5%', width: '13%', height: '22%' },
      3: { top: '71%', left: '48.6%', width: '13%', height: '22%' },
      4: { top: '71%', left: '66.5%', width: '13%', height: '22%' },
    };
    return floor1Positions[table.tableNumber] || { top: '0%', left: '0%', width: '5%', height: '5%' };
  } else {
    // Floor 2 positions (not used for now)
    return { top: '0%', left: '0%', width: '5%', height: '5%' };
  }
};

export default Reservations;
