import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useCart } from './CartContext';
import { getUserByEmail } from '../services/reservationService';
import { UserDto } from '../types/Interfaces';

export interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchUser = async (storedToken: string) => {
      try {
        const decoded: any = jwtDecode(storedToken);
        if (decoded && decoded.sub && decoded.role && !isTokenExpired(decoded)) {
          const fetchedUser: UserDto = await getUserByEmail(decoded.sub);
          setUser({
            id: fetchedUser.id,
            email: fetchedUser.email,
            role: fetchedUser.role,
          });
          setToken(storedToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
          throw new Error('Invalid or expired token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('jwtToken');
        setUser(null);
        setToken(null);
        toast.error('Your session has expired. Please log in again.');
      }
    };

    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      fetchUser(storedToken);
    }
  }, []);

  const isTokenExpired = (decodedToken: any): boolean => {
    if (!decodedToken.exp) return true;
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };

  const login = (newToken: string) => {
    const fetchAndSetUser = async () => {
      try {
        const decoded: any = jwtDecode(newToken);
        if (decoded && decoded.sub && decoded.role && !isTokenExpired(decoded)) {
          setToken(newToken);
          localStorage.setItem('jwtToken', newToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

          const fetchedUser: UserDto = await getUserByEmail(decoded.sub);
          setUser({
            id: fetchedUser.id,
            email: fetchedUser.email,
            role: fetchedUser.role,
          });
          toast.success('Logged in successfully!');
        } else {
          throw new Error('Invalid or expired token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        toast.error('Failed to log in. Please try again.');
      }
    };

    fetchAndSetUser();
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearCart();
    localStorage.removeItem('jwtToken');
    delete api.defaults.headers.common['Authorization'];
    toast.info('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
