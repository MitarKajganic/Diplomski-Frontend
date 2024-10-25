import React, { useEffect, useState } from 'react';
import { Typography, Container, List, ListItem, ListItemText, CircularProgress, Box, Alert } from '@mui/material';
import api from '../services/api';
import { OrderDto } from '../types/Interfaces';

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get<OrderDto[]>('/orders');
        setOrders(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Orders
        </Typography>
        {orders.length === 0 ? (
          <Typography>No orders found.</Typography>
        ) : (
          <List>
            {orders.map((order) => (
              <ListItem key={order.id} divider>
                <ListItemText
                  primary={order}
                  secondary={`Status: ${order.status}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
