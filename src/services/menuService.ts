import api from './api';
import { MenuDto } from '../types/Interfaces';

/**
 * Fetches the entire menu from the backend.
 * @returns A promise that resolves to an array of MenuDtos.
 * @throws An error if the request fails.
 */
export const getMenus = async (): Promise<MenuDto[]> => {
  try {
    const response = await api.get<MenuDto[]>('/menus'); // Adjust the endpoint as needed
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches a specific menu by name.
 * @param menuName - The name of the menu to fetch.
 * @returns A promise that resolves to MenuDto.
 * @throws An error if the request fails.
 */
export const getMenuByName = async (menuName: string): Promise<MenuDto> => {
  try {
    const response = await api.get<MenuDto>(`/menus/name/${menuName}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
