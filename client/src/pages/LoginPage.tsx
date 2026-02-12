import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/authStore';
import { loginSchema, type LoginFormData } from '../utils/validationSchemas';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, loading, error, clearError, isAuthenticated } = useAuthStore();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    useEffect(() => {
        if (isAuthenticated) {
            setSuccessMessage('Login successful! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <AuthLayout
            title="Issue Tracker"
            subtitle="Welcome back! Please sign in to continue"
            footerText="Don't have an account?"
            footerLinkText="Create an account"
            footerLinkTo="/register"
            successMessage={successMessage}
            error={error}
            onClearError={clearError}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <Input
                    {...register('email')}
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    error={errors.email?.message}
                    disabled={loading || isSubmitting}
                    required
                />

                <Input
                    {...register('password')}
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    disabled={loading || isSubmitting}
                    required
                />

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-blue-900 hover:text-blue-700 font-medium">
                        Forgot password?
                    </a>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={loading || isSubmitting}
                    className="bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    {loading || isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;