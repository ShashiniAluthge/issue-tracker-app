import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Layout } from '../components/layout/Layout';
import { createIssueSchema, type CreateIssueFormData } from '../utils/validationSchemas';
import { issueService } from '../services/issueService';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { MdSave } from 'react-icons/md';
import { HiExclamationCircle } from 'react-icons/hi';

export const CreateIssuePage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateIssueFormData>({
        resolver: zodResolver(createIssueSchema),
        defaultValues: {
            priority: 'medium',
            severity: 'major',
        },
    });

    const onSubmit = async (data: CreateIssueFormData) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await issueService.createIssue(data);
            setSuccessMessage('Issue created successfully!');

            // Wait a moment to show success message
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Failed to create issue. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Issue</h1>
                    <p className="text-gray-600 mt-2">Report a new issue or bug for tracking</p>
                </div>

                {/* Success Message */}
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
                            <p className="text-sm text-green-600 mt-1">Redirecting to dashboard...</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                        <HiExclamationCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Issue Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                {...register('title')}
                                type="text"
                                placeholder="Enter issue title"
                                error={errors.title?.message}
                                disabled={loading}
                            />

                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register('description')}
                                rows={6}
                                placeholder="Provide detailed information about the issue..."
                                disabled={loading}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.description
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300'
                                    } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                            )}

                        </div>

                        {/* Priority and Severity Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register('priority')}
                                    disabled={loading}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.priority
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300'
                                        } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                                {errors.priority && (
                                    <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                                )}

                            </div>

                            {/* Severity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Severity <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register('severity')}
                                    disabled={loading}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.severity
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300'
                                        } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                >
                                    <option value="minor">Minor</option>
                                    <option value="major">Major</option>
                                    <option value="critical">Critical</option>
                                </select>
                                {errors.severity && (
                                    <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>
                                )}

                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                isLoading={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <MdSave className="mr-2 text-lg" />
                                {loading ? 'Creating Issue...' : 'Create Issue'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => navigate('/dashboard')}
                                disabled={loading}
                                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>

            </div>
        </Layout>
    );
};

export default CreateIssuePage;