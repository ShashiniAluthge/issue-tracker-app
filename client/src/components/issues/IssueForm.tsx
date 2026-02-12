import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { MdSave } from 'react-icons/md';
import type { CreateIssueFormData, EditIssueFormData } from '../../utils/validationSchemas';

interface IssueFormProps {
    mode: 'create' | 'edit';
    register: UseFormRegister<CreateIssueFormData | EditIssueFormData>;
    errors: FieldErrors<CreateIssueFormData | EditIssueFormData>;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export const IssueForm: React.FC<IssueFormProps> = ({
    mode,
    register,
    errors,
    loading,
    onSubmit,
    onCancel,
}) => {
    const isEditMode = mode === 'edit';

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Title <span className="text-red-500">*</span>
                </label>
                <Input
                    {...register('title')}
                    type="text"
                    placeholder={isEditMode ? 'Brief description of the issue' : 'Enter issue title'}
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

            {/* Status, Priority, Severity*/}
            <div className={`grid grid-cols-1 ${isEditMode ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                {/* Status*/}
                {isEditMode && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('status' as keyof (CreateIssueFormData | EditIssueFormData))}
                            disabled={loading}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${(errors as FieldErrors<EditIssueFormData>).status
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300'
                                } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                        {(errors as FieldErrors<EditIssueFormData>).status && (
                            <p className="mt-1 text-sm text-red-600">
                                {(errors as FieldErrors<EditIssueFormData>).status?.message}
                            </p>
                        )}
                    </div>
                )}

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
                    size="sm"
                    isLoading={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                    <MdSave className="mr-2 text-lg" />
                    {loading
                        ? isEditMode
                            ? 'Saving Changes...'
                            : 'Creating Issue...'
                        : isEditMode
                            ? 'Save Changes'
                            : 'Create Issue'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};