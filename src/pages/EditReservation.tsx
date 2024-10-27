// src/pages/EditReservation.tsx

import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  Divider,
  Autocomplete,
} from '@mui/material';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ReservationDto,
  ReservationCreateDto,
  ApiError,
  Role,
  TableDto,
  UserDto,
} from '../types/Interfaces';
import {
  getReservationById,
  updateReservation,
  getAllTables,
  getAllUsers,
} from '../services/reservationService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import { SelectChangeEvent } from '@mui/material/Select';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EditReservation: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [reservation, setReservation] = useState<ReservationDto | null>(null);
  const [tables, setTables] = useState<TableDto[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);
  const [reservationTime, setReservationTime] = useState<Date | null>(new Date());
  const [guestInfo, setGuestInfo] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    const fetchReservationData = async () => {
      if (!reservationId) {
        toast.error('No reservation ID provided.');
        navigate('/dashboard');
        return;
      }

      if (!user || !(user.role === Role.STAFF || user.role === Role.ADMIN)) {
        toast.error('Unauthorized access.');
        navigate('/dashboard');
        return;
      }

      try {
        // Fetch All Users
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);

        // Fetch Reservation Details
        const fetchedReservation = await getReservationById(reservationId);
        setReservation(fetchedReservation);
        setSelectedTableId(fetchedReservation.tableId);
        setNumberOfGuests(fetchedReservation.numberOfGuests);
        setReservationTime(new Date(fetchedReservation.reservationTime));

        if (fetchedReservation.userId) {
          const fetchedUser = fetchedUsers.find((u) => u.id === fetchedReservation.userId) || null;
          setSelectedUser(fetchedUser);
        } else {
          setGuestInfo({
            guestName: fetchedReservation.guestName || '',
            guestEmail: fetchedReservation.guestEmail || '',
            guestPhone: fetchedReservation.guestPhone || '',
          });
        }

        // Fetch All Tables
        const fetchedTables = await getAllTables();
        const sortedTables = fetchedTables.sort((a, b) => a.tableNumber - b.tableNumber);
        setTables(sortedTables);
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

    fetchReservationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationId, user]);

  const handleTableChange = (e: SelectChangeEvent<string>) => {
    setSelectedTableId(e.target.value);
    const table = tables.find((t) => t.id === e.target.value);
    if (table) {
      // Optionally, validate numberOfGuests against table.capacity here
    }
  };

  const handleUserChange = (event: any, value: UserDto | null) => {
    setSelectedUser(value);
    if (value) {
      setGuestInfo({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
      });
    }
  };

  const handleGuestInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!reservationId) {
      toast.error('Reservation ID is missing.');
      return;
    }

    if (!reservation) {
      toast.error('Reservation data is missing.');
      return;
    }

    // Additional validation can be added here
    if (!selectedTableId) {
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

    if (!selectedUser && (!guestInfo.guestName || !guestInfo.guestEmail || !guestInfo.guestPhone)) {
      toast.error('Please fill out all guest details.');
      return;
    }

    setUpdating(true);

    try {
      // Prepare ReservationCreateDto
      const updatedReservation: ReservationCreateDto = {
        tableId: selectedTableId,
        reservationTime: new Date(reservationTime.getTime() + 60 * 60 * 1000).toISOString(),
        numberOfGuests: numberOfGuests,
        userId: selectedUser ? selectedUser.id : undefined,
        guestName: selectedUser ? undefined : guestInfo.guestName,
        guestEmail: selectedUser ? undefined : guestInfo.guestEmail,
        guestPhone: selectedUser ? undefined : guestInfo.guestPhone,
      };

      // Send Update Request
      await updateReservation(reservationId, updatedReservation);
      toast.success('Reservation updated successfully!');
      navigate(`/reservations/${reservationId}`);
    } catch (err: any) {
      console.error('Update Reservation Error:', err);
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
          <Alert severity="error">
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

  if (!reservation) {
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
              Edit Reservation
            </Typography>

            {/* Edit Form */}
            <Box>
              {/* Table Selection */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="table-label" sx={{ color: '#ffffff' }}>
                  Table
                </InputLabel>
                <Select
                  labelId="table-label"
                  value={selectedTableId}
                  label="Table"
                  onChange={handleTableChange}
                  sx={{
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
                    '& .MuiSvgIcon-root': { color: '#ffffff' },
                  }}
                >
                  {tables.map((table) => (
                    <MenuItem key={table.id} value={table.id}>
                      Table {table.tableNumber} (Capacity: {table.capacity})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* User Selection with Autocomplete */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) => `${option.email} (${option.role})`}
                  value={selectedUser}
                  onChange={handleUserChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="User"
                      InputLabelProps={{ style: { color: '#ffffff' } }}
                      sx={{
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: '#ffffff' },
                          '&:hover fieldset': { borderColor: '#ffffff' },
                          '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                        },
                        '& .MuiAutocomplete-inputRoot': {
                          color: '#ffffff',
                        },
                        '& .MuiAutocomplete-input': {
                          color: '#ffffff',
                        },
                        '& .MuiSvgIcon-root': { color: '#ffffff' },
                      }}
                    />
                  )}
                  clearOnEscape
                />
              </FormControl>

              {/* Guest Information (Visible if No User Selected) */}
              {!selectedUser && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    Guest Information
                  </Typography>
                  <Divider sx={{ mb: 2, backgroundColor: '#ffffff' }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Guest Name"
                        name="guestName"
                        value={guestInfo.guestName}
                        onChange={handleGuestInfoChange}
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
                    <Grid item xs={12}>
                      <TextField
                        label="Guest Email"
                        name="guestEmail"
                        value={guestInfo.guestEmail}
                        onChange={handleGuestInfoChange}
                        fullWidth
                        required
                        type="email"
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
                    <Grid item xs={12}>
                      <TextField
                        label="Guest Phone"
                        name="guestPhone"
                        value={guestInfo.guestPhone}
                        onChange={handleGuestInfoChange}
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
              )}

              {/* Number of Guests */}
              <Box sx={{ mb: 4 }}>
                <TextField
                  label="Number of Guests"
                  type="number"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 1)}
                  fullWidth
                  required
                  InputProps={{ inputProps: { min: 1 } }}
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  sx={{
                    '& .MuiInputLabel-root': { color: '#ffffff' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#ffffff' },
                      '&:hover fieldset': { borderColor: '#ffffff' },
                      '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                    },
                  }}
                />
              </Box>

              {/* Reservation Time using DateTimePicker */}
              <Box sx={{ mb: 4 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Reservation Time"
                    value={reservationTime}
                    onChange={(newValue: Date | null) => setReservationTime(newValue)}
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
                    minDate={new Date()}
                    disablePast
                  />
                </LocalizationProvider>
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
                  {updating ? <CircularProgress size={24} color="inherit" /> : 'Update Reservation'}
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

// Utility function to get table position (if needed)
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

export default EditReservation;
