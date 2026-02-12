import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { type LoginCredentials, type RegisterData, type AuthResponse, type User } from '../types/auth.types';

interface AuthController {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;

    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

export const useAuthController = (): AuthController => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = !!token;

    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        setError(null);
        try {
            const response: AuthResponse = await authService.login(credentials);

            setUser(response.user);
            setToken(response.token);

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            setLoading(false);

            // Redirect 
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Login failed');
            setLoading(false);
            throw err;
        }
    };

    const register = async (data: RegisterData) => {
        setLoading(true);
        setError(null);
        try {
            await authService.register(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
            setLoading(false);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        setError(null);
    };

    const clearError = () => setError(null);

    return { user, token, isAuthenticated, loading, error, login, register, logout, clearError };
};
