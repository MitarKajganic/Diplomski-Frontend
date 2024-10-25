import api from './api';
import { UserDto, OrderCreateDto, OrderDto, BillDto, TransactionCreateDto, TransactionDto  } from '../types/Interfaces';



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