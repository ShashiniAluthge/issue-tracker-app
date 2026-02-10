import API from './api';
import { type LoginCredentials, type RegisterData, type AuthResponse } from '../types/auth.types';

export const authService = {
    register: async (userData: RegisterData): Promise<AuthResponse> => {

        console.log('Request data:', { email: userData.email, name: userData.name });

        try {
            const response = await API.post('/auth/register', userData);
            console.log('Register API response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error(error.response?.data || error.message);
            throw error;
        }
    },

    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {

            const response = await API.post('/auth/login', credentials);

            console.log('Raw response:', response);
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);


            // Validate response structure
            if (!response.data) {
                console.error('No data in response');
                throw new Error('Invalid response from server');
            }

            if (!response.data.token) {
                console.error('No token in response');
                throw new Error('No token received from server');
            }

            if (!response.data.user) {
                console.error('No user in response');
                throw new Error('No user data received from server');
            }

            return response.data;

        } catch (error: any) {
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);

            throw error;
        }
    },
};