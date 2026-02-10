import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/authStore';
import { loginSchema, type LoginFormData } from '../utils/validationSchemas';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Alert } from '../components/common/Alert';

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
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-blue-100 px-4 py-12">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
                    {/* Header Section with Navy Blue */}
                    <div className="bg-linear-to-r from-blue-900 to-blue-800 px-8 py-10 text-center">
                        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <svg
                                className="w-8 h-8 text-blue-900"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Issue Tracker</h1>
                        <p className="text-blue-200 text-sm">Welcome back! Please sign in to continue</p>
                    </div>

                    {/* Form Section */}
                    <div className="px-8 py-8">
                        {/* Success Alert */}
                        {successMessage && (
                            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                                <svg
                                    className="w-5 h-5 text-green-600 mt-0.5 mr-3 shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                                </div>
                            </div>
                        )}

                        {/* Error Alert */}
                        {error && (
                            <div className="mb-6">
                                <Alert type="error" message={error} onClose={clearError} />
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                            <Input
                                {...register('email')}
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
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
                                className="bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                            >
                                {loading || isSubmitting ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="mt-8 mb-6 flex items-center">
                            <div className="flex-1 border-t border-gray-200"></div>
                            <span className="px-4 text-sm text-gray-500">or</span>
                            <div className="flex-1 border-t border-gray-200"></div>
                        </div>

                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-blue-900 hover:text-blue-700 font-semibold transition-colors"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;