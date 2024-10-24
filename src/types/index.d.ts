// Enums.ts

export enum Method {
  CASH = 'CASH',
  CARD = 'CARD',
}

export enum Position {
  WAITER = 'WAITER',
  COOK = 'COOK',
  BARTENDER = 'BARTENDER',
  MANAGER = 'MANAGER',
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

export enum Status {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export enum Type {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
}

// Interfaces.ts

import {
  Method,
  Position,
  Role,
  Status,
  Type,
} from './Enums'; // Adjust the import path as necessary

export interface LoginResponse {
  token: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors: string[];
}

export interface OrderItemDto {
  id: string;
  price: number;
  quantity: number;
  orderId: string;
  menuItemId: string;
}

export interface OrderDto {
  id: string;
  createdAt: string; // ISO date string
  status: Status;
  userId: string;
  orderItems: OrderItemDto[];
  billId: string | null;
}

export interface ReservationDto {
  id: string;
  reservationTime: string; // ISO date string
  numberOfGuests: number;
  userId: string | null;
  tableId: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
}

export interface UserDto {
  id: string;
  email: string;
  role: Role;
  active: boolean;
  reservations?: ReservationDto[];
}

export interface StaffDto extends UserDto {
  name: string;
  surname: string;
  position: Position;
  contactInfo: string;
}

export interface TableDto {
  id: string;
  tableNumber: number;
  capacity: number;
  isAvailable: boolean;
  reservations?: ReservationDto[];
}

export interface BillDto {
  id: string;
  totalAmount: number;
  tax: number;
  finalAmount: number;
  createdAt: string; // ISO date string
  orderId: string;
}

export interface MenuItemDto {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  menuId: string | null;
}

export interface MenuDto {
  id: string;
  name: string;
  items?: MenuItemDto[];
}

export interface InventoryDto {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  lowStock: boolean;
}

export interface TransactionDto {
  id: string;
  transactionTime: string; // ISO date string
  amount: number;
  type: Type;
  method: Method;
  billId: string;
}

// Add more interfaces as required
