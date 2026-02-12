import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User, type LoginCredentials, type RegisterData } from '../types/auth.types';
import { authService } from '../services/authService';

interface AuthState {
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

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,

            login: async (credentials) => {
                set({ loading: true, error: null });
                try {
                    const response = await authService.login(credentials);

                    // Store token in localStorage
                    if (response.token) {
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('user', JSON.stringify(response.user));
                    }

                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        loading: false,
                        error: null,
                    });
                } catch (error: any) {
                    const errorMessage =
                        error.response?.data?.message ||
                        error.response?.data?.error ||
                        'Invalid email or password';

                    set({
                        error: errorMessage,
                        loading: false,
                        isAuthenticated: false,
                        user: null,
                        token: null,
                    });
                    throw error;
                }
            },

            register: async (data) => {
                set({ loading: true, error: null });
                try {
                    await authService.register(data);
                    set({ loading: false, error: null });
                } catch (error: any) {
                    const errorMessage =
                        error.response?.data?.message ||
                        error.response?.data?.error ||
                        'Registration failed';

                    set({
                        error: errorMessage,
                        loading: false,
                    });
                    throw error;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);