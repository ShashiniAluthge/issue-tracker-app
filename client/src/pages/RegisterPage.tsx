import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/authStore';
import { registerSchema, type RegisterFormData } from '../utils/validationSchemas';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register: registerUser, loading, error, clearError } = useAuthStore();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            setSuccessMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    return (
        <AuthLayout
            title="Issue Tracker"
            subtitle="Create your account to get started"
            footerText="Already have an account?"
            footerLinkText="Sign in"
            footerLinkTo="/login"
            successMessage={successMessage}
            error={error}
            onClearError={clearError}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <Input
                    {...register('name')}
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    error={errors.name?.message}
                    disabled={loading || isSubmitting}
                    required
                />

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
                    placeholder="Create a password (min 6 characters)"
                    error={errors.password?.message}
                    disabled={loading || isSubmitting}
                    required
                />

                <Input
                    {...register('confirmPassword')}
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    error={errors.confirmPassword?.message}
                    disabled={loading || isSubmitting}
                    required
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={loading || isSubmitting}
                    className="bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    {loading || isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default RegisterPage;