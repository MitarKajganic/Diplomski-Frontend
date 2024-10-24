// src/services/api.ts
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        // toast.error('Session expired. Please log in again.');
        toast.error(data.message || 'Session expired. Please log in again.');
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else {
        toast.error(data.message || 'An error occurred. Please try again.');
      }
    } else if (error.request) {
      toast.error('No response from the server. Please try again later.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
);

export default api;
