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
  name: string;
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
  deliveryInfo: DeliveryInfo;
}

export interface OrderCreateDto {
  status: Status; // "PENDING", "COMPLETED", "CANCELLED"
  userId: string;
  menuItemIdsAndQuantities: { [key: string]: number };
  deliveryInfo: DeliveryInfo;
}

export interface DeliveryInfo {
  firstName: string;
  lastName: string;
  street: string;
  number: string;
  floor: number | null;
  phoneNumber: string;
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

export interface ReservationCreateDto {
  tableId: string;
  reservationTime: string; // ISO date string
  numberOfGuests: number;
  userId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
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
  stripeUrl: string | null;
  stripeSessionId: string | null;
  stripeStatus: string | null;
}

export interface TransactionCreateDto {
  amount: number;
  type: Type;
  method: Method;
  billId: string;
}

