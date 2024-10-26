import api from './api';
import {
  ReservationDto,
  TableDto,
  UserDto,
  ReservationCreateDto,
} from '../types/Interfaces';

/**
 * Fetches all tables from the backend.
 */
export const getAllTables = async (): Promise<TableDto[]> => {
  try {
    const response = await api.get<TableDto[]>('/tables');
    return response.data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

/**
 * Retrieves tables on Floor 1 (Table Numbers 1-4).
 */
export const getTablesFloor1 = async (): Promise<TableDto[]> => {
  try {
    const allTables = await getAllTables();
    return allTables.filter((table) => table.tableNumber >= 1 && table.tableNumber <= 4);
  } catch (error) {
    console.error('Error fetching Floor 1 tables:', error);
    throw error;
  }
};

/**
 * Retrieves tables on Floor 2 (Table Numbers 5-16).
 */
export const getTablesFloor2 = async (): Promise<TableDto[]> => {
  try {
    const allTables = await getAllTables();
    return allTables.filter((table) => table.tableNumber >= 5 && table.tableNumber <= 16);
  } catch (error) {
    console.error('Error fetching Floor 2 tables:', error);
    throw error;
  }
};

/**
 * Fetch reservations by user ID.
 */
export const getReservationsByUserId = async (
  userId: string
): Promise<ReservationDto[]> => {
  try {
    const response = await api.get<ReservationDto[]>(`/reservations/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations by user ID:', error);
    throw error;
  }
};

/**
 * Create a new reservation.
 */
export const createReservation = async (
  reservationData: ReservationCreateDto
): Promise<ReservationDto> => {
  try {
    const response = await api.post<ReservationDto>('/reservations', reservationData);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

/**
 * Fetch reservation details by reservation ID.
 */
export const getReservationById = async (
  reservationId: string
): Promise<ReservationDto> => {
  try {
    const response = await api.get<ReservationDto>(`/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservation details:', error);
    throw error;
  }
};

/**
 * Fetch user details by email.
 */
export const getUserByEmail = async (email: string): Promise<UserDto> => {
  try {
    const response = await api.get<UserDto>(`/users/email/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
};
