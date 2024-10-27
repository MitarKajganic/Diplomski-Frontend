import api from './api';
import {
    UserDto,
    StaffDto,
} from '../types/Interfaces';

// User-related API calls
export const getAllUsers = async (): Promise<UserDto[]> => {
    const response = await api.get<UserDto[]>('/users');
    return response.data;
};

export const getUserById = async (userId: string): Promise<UserDto> => {
    const response = await api.get<UserDto>(`/users/user/${userId}`);
    return response.data;
};

export const getUserByEmail = async (email: string): Promise<UserDto> => {
    const response = await api.get<UserDto>(`/users/email/${email}`);
    return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
    await api.delete(`users/delete/${userId}`);
};

export const disableUser = async (userId: string): Promise<void> => {
    await api.put(`users/disable/${userId}`);
};

export const enableUser = async (userId: string): Promise<void> => {
    await api.put(`users/enable/${userId}`);
}

export const updateUser = async (
    userId: string,
    email: string,
    password: string
): Promise<UserDto> => {
    const payload = { email, password };
    const response = await api.put<UserDto>(`users/update/${userId}`, payload);
    return response.data;
};

// Staff-related API calls
export const getAllStaff = async (): Promise<StaffDto[]> => {
    const response = await api.get<StaffDto[]>('/staff');
    return response.data;
};

export const getStaffById = async (staffId: string): Promise<StaffDto> => {
    const response = await api.get<StaffDto>(`/staff/${staffId}`);
    return response.data;
};

export const createStaff = async (staffData: Partial<StaffDto> & { email: string; password: string }): Promise<StaffDto> => {
    const response = await api.post<StaffDto>('/staff', staffData);
    return response.data;
};

export const updateStaff = async (
    staffId: string,
    staffData: Partial<StaffDto> & { email: string; password: string }
): Promise<StaffDto> => {
    const response = await api.put<StaffDto>(`/staff/update/${staffId}`, staffData);
    return response.data;
};

export const deleteStaff = async (staffId: string): Promise<void> => {
    await api.delete(`/staff/delete/${staffId}`);
};

export const disableStaff = async (staffId: string): Promise<void> => {
    await api.put(`/staff/disable/${staffId}`);
};
