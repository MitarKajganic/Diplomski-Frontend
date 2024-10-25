// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useCart } from './CartContext';

export interface User {
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
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        if (decoded && decoded.sub && decoded.role && !isTokenExpired(decoded)) {
          setUser({
            email: decoded.sub,
            role: decoded.role,
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
    }
  }, []);

  const isTokenExpired = (decodedToken: any): boolean => {
    if (!decodedToken.exp) return true;
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  };

  const login = (newToken: string) => {
    try {
      const decoded: any = jwtDecode(newToken);
      if (decoded && decoded.sub && decoded.role && !isTokenExpired(decoded)) {
        setUser({
          email: decoded.sub,
          role: decoded.role,
        });
        setToken(newToken);
        localStorage.setItem('jwtToken', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        toast.success('Logged in successfully!');
      } else {
        throw new Error('Invalid or expired token');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      toast.error('Failed to log in. Please try again.');
    }
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
