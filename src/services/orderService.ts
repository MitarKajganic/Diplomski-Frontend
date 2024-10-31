import api from './api';
import {
  UserDto,
  OrderCreateDto,
  OrderDto,
  BillDto,
  TransactionCreateDto,
  TransactionDto
} from '../types/Interfaces';

// Fetch user by email
export const getUserByEmail = async (email: string): Promise<UserDto> => {
  const response = await api.get<UserDto>(`/users/email/${email}`);
  return response.data;
};

// Create a new order
export const createOrder = async (orderData: OrderCreateDto): Promise<OrderDto> => {
  const response = await api.post<OrderDto>('/orders', orderData);
  return response.data;
};

// Create a bill for an order
export const createBill = async (orderId: string): Promise<BillDto> => {
  const response = await api.post<BillDto>('/bills', { orderId });
  return response.data;
};

// Create a transaction
export const createTransaction = async (transactionData: TransactionCreateDto): Promise<TransactionDto> => {
  const response = await api.post<TransactionDto>('/transactions', transactionData);
  return response.data;
};

// Fetch bill by bill ID
export const getBillById = async (billId: string): Promise<BillDto> => {
  const response = await api.get<BillDto>(`/bills/${billId}`);
  return response.data;
};

// Fetch transactions by bill ID
export const getTransactionsByBillId = async (billId: string): Promise<TransactionDto[]> => {
  const response = await api.get<TransactionDto[]>(`/transactions/bill/${billId}`);
  return response.data;
};

// Fetch all orders for a user by user ID
export const getOrdersByUserId = async (userId: string): Promise<OrderDto[]> => {
  const response = await api.get<OrderDto[]>(`/orders/user/${userId}`);
  return response.data;
};

// Fetch order by order ID
export const getOrderById = async (orderId: string): Promise<OrderDto> => {
  const response = await api.get<OrderDto>(`/orders/${orderId}`);
  return response.data;
};

// Fetch all Orders
export const getAllOrders = async (): Promise<OrderDto[]> => {
  const response = await api.get<OrderDto[]>('/orders');
  return response.data;
};

// Fetch all MenuItems
export const getAllMenuItems = async () => {
  const response = await api.get('/menu-items');
  return response.data;
};

// Update an Order
export const updateOrder = async (orderId: string, orderCreateDto: OrderCreateDto) => {
  const response = await api.put(`/orders/update/${orderId}`, orderCreateDto);
  return response.data;
};

// Get transaction by session ID
export const getTransactionBySessionId = async (sessionId: string): Promise<TransactionDto> => {
  const response = await api.get<TransactionDto>(`/transactions/stripe/${sessionId}`);
  return response.data;
};
