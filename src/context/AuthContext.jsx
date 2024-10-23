import React, { createContext, useState, useEffect } from 'react';
import axios from '../services/api';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        user: null,
    });

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            setAuthState({
                token,
                user: {
                    email: decoded.sub,
                    role: decoded.role,
                },
            });
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('jwtToken', token);
        const decoded = jwtDecode(token);
        setAuthState({
            token,
            user: {
                email: decoded.sub,
                role: decoded.role,
            },
        });
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setAuthState({
            token: null,
            user: null,
        });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
