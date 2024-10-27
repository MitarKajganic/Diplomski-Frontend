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
 * Fetch table by table ID.
 */
export const getTableByTableId = async (
    tableId: string
): Promise<TableDto> => {
    try {
        const response = await api.get<TableDto>(`/tables/${tableId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching table by table ID:', error);
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
        const response = await api.get<ReservationDto[]>(`/reservations/user/${userId}`);
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

/**
 * Find reservation by guest name
 */
export const findReservationByGuestName = async (guestName: string): Promise<ReservationDto[]> => {
    try {
        const response = await api.get<ReservationDto[]>(`/guest-name/${encodeURIComponent(guestName)}`);
        return response.data;
    } catch (error) {
        console.error('Error finding reservation by guest name:', error);
        throw error;
    }
};

/**
 * Find reservation by guest email
 */
export const findReservationByGuestEmail = async (guestEmail: string): Promise<ReservationDto[]> => {
    try {
        const response = await api.get<ReservationDto[]>(`/guest-email/${encodeURIComponent(guestEmail)}`);
        return response.data;
    } catch (error) {
        console.error('Error finding reservation by guest email:', error);
        throw error;
    }
};

/**
 * Fetch all reservations.
 */
export const getAllReservations = async (): Promise<ReservationDto[]> => {
    try {
        const response = await api.get<ReservationDto[]>('/reservations');
        return response.data;
    } catch (error) {
        console.error('Error fetching all reservations:', error);
        throw error;
    }
};

/**
 * Fetch reservations by guest phone.
 */
export const getReservationsByGuestPhone = async (guestPhone: string): Promise<ReservationDto[]> => {
    try {
        const response = await api.get<ReservationDto[]>(`/reservations/guest-phone/${encodeURIComponent(guestPhone)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reservations by guest phone:', error);
        throw error;
    }
};

/**
 * Fetch reservations by guest email.
 */
export const getReservationsByGuestEmail = async (guestEmail: string): Promise<ReservationDto[]> => {
    try {
        const response = await api.get<ReservationDto[]>(`/reservations/guest-email/${encodeURIComponent(guestEmail)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reservations by guest email:', error);
        throw error;
    }
};

/**
 * Fetch reservations by guest name.
 */
export const getReservationsByGuestName = async (guestName: string): Promise<ReservationDto[]> => {
    try {
        const response = await api.get<ReservationDto[]>(`/reservations/guest-name/${encodeURIComponent(guestName)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reservations by guest name:', error);
        throw error;
    }
};