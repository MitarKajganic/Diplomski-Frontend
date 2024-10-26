import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
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
  getAllTables,
  createReservation,
} from '../services/reservationService';
import { TableDto, ReservationCreateDto } from '../types/Interfaces';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Tooltip from '@mui/material/Tooltip';
import { addDays, setHours, setMinutes } from 'date-fns';

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
  fontSize: '2rem',
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

  const [reservationTime, setReservationTime] = useState<Date | null>(
    setHours(setMinutes(addDays(new Date(), 1), 0), 10)
  );
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');

  const [selectedTableCapacity, setSelectedTableCapacity] = useState<number | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const fetchedTables = await getAllTables();
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

  const handleTableClick = (table: TableDto) => {
    if (!table.isAvailable) {
      toast.error(`Table ${table.tableNumber} is not available.`);
      return;
    }

    if (selectedTable === table.id) {
      setSelectedTable(null);
      setSelectedTableCapacity(null);
      toast.info(`Table ${table.tableNumber} deselected.`);
    } else {
      setSelectedTable(table.id);
      setSelectedTableCapacity(table.capacity);
      toast.success(`Table ${table.tableNumber} selected.`);
    }
  };

  const isValidReservationTime = (date: Date): boolean => {
    const hour = date.getHours();
    const minute = date.getMinutes();

    if (hour < 10 || (hour === 19 && minute > 30) || hour > 19) {
      return false;
    }
    return true;
  };

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
    }

    if (!isValidReservationTime(reservationTime)) {
      toast.error('Please select a time between 10:00 AM and 7:30 PM.');
      return;
    }

    setReservationLoading(true);

    try {
      const reservationData: ReservationCreateDto = {
        tableId: selectedTable,
        reservationTime: new Date(reservationTime.getTime() + 60 * 60 * 1000).toISOString(),
        numberOfGuests: numberOfGuests,
        userId: user ? user.id : undefined,
        guestName: user ? undefined : guestName,
        guestEmail: user ? undefined : guestEmail,
        guestPhone: user ? undefined : guestPhone,
      };

      console.log('Reservation Data:', reservationData);

      const reservation = await createReservation(reservationData);

      toast.success('Reservation confirmed successfully!');

      navigate(`/reservations/${reservation.id}`);

      setSelectedTable(null);
      setSelectedTableCapacity(null);
      setReservationTime(setHours(setMinutes(addDays(new Date(), 1), 0), 10));
      setNumberOfGuests(1);
      setGuestName('');
      setGuestEmail('');
      setGuestPhone('');
    } catch (err: any) {
      console.error('Reservation error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to confirm reservation. Please try again.');
      }
    } finally {
      setReservationLoading(false);
    }
  };

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
            paddingX: 2,
          }}
        >

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
                color: 'white',
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
                  minDate={addDays(new Date(), 1)}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        ...textFieldStyles,
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                      },
                    },
                    dialog: {
                      PaperProps: {
                        sx: {
                          backgroundColor: 'rgba(64, 64, 64, 1)',
                          color: '#ffffff',
                          '& .MuiTypography-root': {
                            color: '#ffffff',
                          },
                          '& .MuiPickersDay-root': {
                            color: '#ffffff',
                          },
                          '& .MuiPickersDay-root.Mui-selected': {
                            color: '#000000',
                          },
                          '& .MuiClockPointer-pointer': {
                            backgroundColor: '#ffffff',
                          },
                          '& .MuiClockPointer-thumb': {
                            backgroundColor: '#ffffff',
                          },
                          '& .MuiClock-face': {
                            color: '#ffffff',
                          },
                          '& .MuiPickersToolbar-toolbar': {
                            backgroundColor: 'rgba(64, 64, 64, 1)',
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

            {/* Selected Table Info and Confirm Button (Moved Below the Form) */}
            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Selected Table:{' '}
                {selectedTable
                  ? (
                    <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      Table {tables.find((t) => t.id === selectedTable)?.tableNumber || ''}
                      {` (Max Capacity: ${selectedTableCapacity || 'N/A'})`}
                    </Box>
                  )
                  : 'None'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{
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

            {/* Floor Plan Container */}
            <Box
              sx={{
                position: 'relative',
                width: '80%',
                maxWidth: '800px',
                margin: '0 auto',
                borderRadius: 2,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden',
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
                  title={table.isAvailable ? 'Available' : 'Not Available'}
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
                      disabled={!table.isAvailable}
                      sx={{
                        backgroundColor:
                          !table.isAvailable
                            ? 'rgba(128, 128, 128, 1)'
                            : selectedTable === table.id
                            ? 'rgba(255, 0, 0, 1)'
                            : [1, 2, 3, 4].includes(table.tableNumber)
                            ? 'rgba(0, 0, 0, 1)'
                            : 'transparent',
                        border:
                          !table.isAvailable
                            ? '2px solid rgba(128, 128, 128, 1)'
                            : [1, 2, 3, 4].includes(table.tableNumber)
                            ? '2px solid rgba(0, 0, 0, 1)'
                            : '2px solid rgba(255, 255, 255, 0.5)',
                        zIndex: 1,
                      }}
                    >
                      {table.tableNumber}
                    </TableButton>
                  </span>
                </Tooltip>
              ))}
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

const getTablePosition = (table: TableDto) => {
  const Positions: {
    [key: number]: { top: string; left: string; width: string; height: string };
  } = {
    1: { top: '34.5%', left: '48.6%', width: '13%', height: '22%' },
    2: { top: '34.5%', left: '66.5%', width: '13%', height: '22%' },
    3: { top: '71%', left: '48.6%', width: '13%', height: '22%' },
    4: { top: '71%', left: '66.5%', width: '13%', height: '22%' },
  };
  return Positions[table.tableNumber] || { top: '0%', left: '0%', width: '5%', height: '5%' };
};

export default Reservations;
