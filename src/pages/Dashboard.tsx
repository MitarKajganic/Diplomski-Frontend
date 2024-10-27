import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import {
  OrderDto,
  ReservationDto,
  ApiError,
  Role,
  TableDto,
} from '../types/Interfaces';
import { getAllOrders } from '../services/orderService';
import { getAllReservationsIncludingDeleted, getTableByTableId } from '../services/reservationService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';

interface EnhancedReservation extends ReservationDto {
  tableNumber: number;
  tableCapacity: number;
}

const Dashboard: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [enhancedReservations, setEnhancedReservations] = useState<EnhancedReservation[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [loadingReservations, setLoadingReservations] = useState<boolean>(true);
  const [errorOrders, setErrorOrders] = useState<ApiError | null>(null);
  const [errorReservations, setErrorReservations] = useState<ApiError | null>(null);

  const [hideNonEditableOrders, setHideNonEditableOrders] = useState<boolean>(false);
  const [hideExpiredReservations, setHideExpiredReservations] = useState<boolean>(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();

        const sortedOrders = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setOrders(sortedOrders);
      } catch (err: any) {
        if (err.response && err.response.data) {
          setErrorOrders(err.response.data as ApiError);
        } else if (err instanceof Error) {
          setErrorOrders({
            status: 500,
            message: err.message,
            errors: [err.message],
          });
        } else {
          setErrorOrders({
            status: 500,
            message: 'An unknown error occurred.',
            errors: ['Unknown error'],
          });
        }
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchReservations = async () => {
      try {
        const data = await getAllReservationsIncludingDeleted();

        const sortedReservations = data.sort(
          (a, b) => new Date(b.reservationTime).getTime() - new Date(a.reservationTime).getTime()
        );

        setReservations(sortedReservations);

        const uniqueTableIds = Array.from(new Set(data.map(reservation => reservation.tableId)));

        const tablePromises = uniqueTableIds.map(id => getTableByTableId(id));
        const tables: TableDto[] = await Promise.all(tablePromises);

        const tableMap: { [key: string]: TableDto } = {};
        tables.forEach(table => {
          tableMap[table.id] = table;
        });

        const enriched: EnhancedReservation[] = data.map(reservation => ({
          ...reservation,
          tableNumber: tableMap[reservation.tableId]?.tableNumber || 0,
          tableCapacity: tableMap[reservation.tableId]?.capacity || 0,
        }));

        setEnhancedReservations(enriched);
      } catch (err: any) {
        if (err.response && err.response.data) {
          setErrorReservations(err.response.data as ApiError);
        } else if (err instanceof Error) {
          setErrorReservations({
            status: 500,
            message: err.message,
            errors: [err.message],
          });
        } else {
          setErrorReservations({
            status: 500,
            message: 'An unknown error occurred.',
            errors: ['Unknown error'],
          });
        }
      } finally {
        setLoadingReservations(false);
      }
    };

    fetchOrders();
    fetchReservations();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const calculateTotalPrice = (orderItems: OrderDto['orderItems']): number => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return <CheckCircleIcon color="success" />;
      case 'PENDING':
        return <HourglassEmptyIcon color="warning" />;
      case 'CANCELLED':
        return <CancelIcon color="error" />;
      default:
        return <HourglassEmptyIcon />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.6 },
    }),
  };

  const handleViewDetails = (type: 'order' | 'reservation', id: string) => {
    navigate(`/${type}s/${id}`);
  };

  const handleEdit = (type: 'order' | 'reservation', id: string) => {
    navigate(`/${type}s/${id}/edit`);
  };

  const isOrderEditable = (status: string): boolean => {
    return !['COMPLETED', 'CANCELLED'].includes(status.toUpperCase());
  };

  const isReservationEditable = (reservationTime: string): boolean => {
    return new Date(reservationTime) > new Date();
  };

  const filteredOrders = hideNonEditableOrders
    ? orders.filter(order => isOrderEditable(order.status))
    : orders;

  const filteredReservations = hideExpiredReservations
    ? enhancedReservations.filter(reservation => isReservationEditable(reservation.reservationTime))
    : enhancedReservations;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, mt: { xs: 10, sm: 12 } }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                textAlign: 'center',
                fontFamily: 'League Spartan, sans-serif',
                color: 'primary.main',
                mt: 4,
                mb: 2,
              }}
            >
              Dashboard
            </Typography>

            {/* Tabs for Orders and Reservations */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                variant="fullWidth"
                aria-label="dashboard tabs"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                  },
                }}
              >
                <Tab
                  label="Orders"
                  sx={{
                    fontFamily: 'League Spartan, sans-serif',
                    fontWeight: 'normal',
                    textTransform: 'none',
                    paddingY: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    color: tabIndex === 0 ? 'primary.main' : 'inherit',
                    '&.Mui-selected': {
                      color: 'primary.main',
                      fontWeight: 'bold',
                    },
                    transition: 'color 0.3s ease, padding 0.3s ease',
                  }}
                />
                <Tab
                  label="Reservations"
                  sx={{
                    fontFamily: 'League Spartan, sans-serif',
                    fontWeight: 'normal',
                    textTransform: 'none',
                    paddingY: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    color: tabIndex === 1 ? 'primary.main' : 'inherit',
                    '&.Mui-selected': {
                      color: 'primary.main',
                      fontWeight: 'bold',
                    },
                    transition: 'color 0.3s ease, padding 0.3s ease',
                  }}
                />
              </Tabs>
            </Box>

            {/* Checkboxes to Hide Non-Editable Items */}
            {tabIndex === 0 && orders.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hideNonEditableOrders}
                      onChange={(e) => setHideNonEditableOrders(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Hide Non-Editable Orders (COMPLETED or CANCELLED)"
                />
              </Box>
            )}
            {tabIndex === 1 && enhancedReservations.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hideExpiredReservations}
                      onChange={(e) => setHideExpiredReservations(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Hide Expired Reservations"
                />
              </Box>
            )}

            {/* Orders Tab Content */}
            {tabIndex === 0 && (
              <Box sx={{ mt: 4 }}>
                {loadingOrders ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress color="primary" />
                  </Box>
                ) : errorOrders ? (
                  <Box sx={{ mt: 4 }}>
                    <Alert severity="error">
                      <Typography variant="h6">{errorOrders.message}</Typography>
                      {errorOrders.errors.map((err, idx) => (
                        <Typography key={idx} variant="body2">
                          {err}
                        </Typography>
                      ))}
                    </Alert>
                  </Box>
                ) : (
                  <Grid container spacing={4}>
                    {filteredOrders.length === 0 ? (
                      <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
                        No orders available.
                      </Typography>
                    ) : (
                      filteredOrders.map((order, index) => {
                        const totalPrice = calculateTotalPrice(order.orderItems);
                        const formattedDate = new Date(order.createdAt).toLocaleDateString();
                        const editable = isOrderEditable(order.status);

                        return (
                          <Grid item xs={12} md={6} key={order.id}>
                            <motion.div
                              custom={index}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true, amount: 0.3 }}
                              variants={cardVariants}
                            >
                              <Card
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  backdropFilter: 'blur(5px) brightness(0.5)',
                                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                  borderRadius: 2,
                                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                                  },
                                  padding: 2,
                                }}
                              >
                                <CardContent>
                                  {/* Total Price and Date */}
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AttachMoneyIcon color="primary" />
                                    <Typography
                                      variant="h6"
                                      sx={{ fontFamily: 'League Spartan, sans-serif', color: 'white' }}
                                    >
                                      Total: ${totalPrice.toFixed(2)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <CalendarTodayIcon color="primary" />
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                      Date: {formattedDate}
                                    </Typography>
                                  </Box>

                                  {/* Status */}
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                    {getStatusIcon(order.status)}
                                    <Typography variant="body1" sx={{ color: 'white' }}>
                                      {order.status}
                                    </Typography>
                                  </Box>

                                  {/* Total Items */}
                                  <Typography variant="body1" sx={{ color: 'white', mt: 2 }}>
                                    <strong>Total Items:</strong> {order.orderItems.length}
                                  </Typography>
                                </CardContent>
                                <CardActions>
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleViewDetails('order', order.id)}
                                    startIcon={<AttachMoneyIcon />}
                                  >
                                    View Details
                                  </Button>
                                  {editable && (user?.role === Role.STAFF || user?.role === Role.ADMIN) && (
                                    <Button
                                      size="small"
                                      color="secondary"
                                      onClick={() => handleEdit('order', order.id)}
                                      startIcon={<EditIcon />}
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </CardActions>
                              </Card>
                            </motion.div>
                          </Grid>
                        );
                      })
                    )}
                  </Grid>
                )}
              </Box>
            )}

            {/* Reservations Tab Content */}
            {tabIndex === 1 && (
              <Box sx={{ mt: 4 }}>
                {loadingReservations ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress color="primary" />
                  </Box>
                ) : errorReservations ? (
                  <Box sx={{ mt: 4 }}>
                    <Alert severity="error">
                      <Typography variant="h6">{errorReservations.message}</Typography>
                      {errorReservations.errors.map((err, idx) => (
                        <Typography key={idx} variant="body2">
                          {err}
                        </Typography>
                      ))}
                    </Alert>
                  </Box>
                ) : (
                  <Grid container spacing={4}>
                    {filteredReservations.length === 0 ? (
                      <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
                        No reservations available.
                      </Typography>
                    ) : (
                      filteredReservations.map((reservation, index) => {
                        const formattedTime = new Date(reservation.reservationTime).toLocaleString();
                        const editable = isReservationEditable(reservation.reservationTime);

                        return (
                          <Grid item xs={12} sm={6} md={4} key={reservation.id}>
                            <motion.div
                              custom={index}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true, amount: 0.3 }}
                              variants={cardVariants}
                            >
                              <Card
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  backdropFilter: 'blur(5px) brightness(0.5)',
                                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                                  borderRadius: 2,
                                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                                  },
                                }}
                              >
                                <CardContent>
                                  {/* Reservation Time */}
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EventNoteIcon color="primary" />
                                    <Typography
                                      variant="h6"
                                      sx={{ fontFamily: 'League Spartan, sans-serif', color: 'white' }}
                                    >
                                      {formattedTime}
                                    </Typography>
                                  </Box>

                                  {/* Number of Guests */}
                                  <Typography variant="body1" sx={{ color: 'white', mt: 2 }}>
                                    <strong>Guests:</strong> {reservation.numberOfGuests}
                                  </Typography>

                                  {/* Table Number */}
                                  <Typography variant="body1" sx={{ color: 'white', mt: 1 }}>
                                    <strong>Table:</strong> Table {reservation.tableNumber}
                                  </Typography>

                                  {/* Table Capacity */}
                                  <Typography variant="body1" sx={{ color: 'white', mt: 1 }}>
                                    <strong>Capacity:</strong> {reservation.tableCapacity}
                                  </Typography>
                                </CardContent>
                                <CardActions>
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleViewDetails('reservation', reservation.id)}
                                    startIcon={<EventNoteIcon />}
                                  >
                                    View Details
                                  </Button>
                                  {editable && (user?.role === Role.STAFF || user?.role === Role.ADMIN) && (
                                    <Button
                                      size="small"
                                      color="secondary"
                                      onClick={() => handleEdit('reservation', reservation.id)}
                                      startIcon={<EditIcon />}
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </CardActions>
                              </Card>
                            </motion.div>
                          </Grid>
                        );
                      })
                    )}
                  </Grid>
                )}
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

export default Dashboard;
