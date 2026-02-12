import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { MdSave } from 'react-icons/md';
import { SelectFilter } from '../common/SelectFilter';

interface IssueFormProps {
    mode: 'create' | 'edit';
    register: UseFormRegister<any>;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
    errors: FieldErrors<any>;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export const IssueForm: React.FC<IssueFormProps> = ({
    mode,
    register,
    watch,
    setValue,
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
                    error={errors.title?.message as string}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                        } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message as string}</p>
                )}
            </div>

            {/* Status, Priority, Severity */}
            <div className={`grid grid-cols-1 ${isEditMode ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                {/* Status - Only in Edit Mode */}
                {isEditMode && (
                    <SelectFilter
                        label="Status"
                        value={watch('status')}
                        onChange={(val) => setValue('status', val)}
                        options={[
                            { label: 'Open', value: 'open' },
                            { label: 'In Progress', value: 'in-progress' },
                            { label: 'Resolved', value: 'resolved' },
                            { label: 'Closed', value: 'closed' },
                        ]}
                        error={errors.status?.message as string}
                        disabled={loading}
                    />
                )}

                {/* Priority */}
                <SelectFilter
                    label="Priority"
                    value={watch('priority')}
                    onChange={(val) => setValue('priority', val)}
                    options={[
                        { label: 'Low', value: 'low' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'High', value: 'high' },
                        { label: 'Critical', value: 'critical' },
                    ]}
                    error={errors.priority?.message as string}
                    disabled={loading}
                />

                {/* Severity */}
                <SelectFilter
                    label="Severity"
                    value={watch('severity')}
                    onChange={(val) => setValue('severity', val)}
                    options={[
                        { label: 'Minor', value: 'minor' },
                        { label: 'Major', value: 'major' },
                        { label: 'Critical', value: 'critical' },
                    ]}
                    error={errors.severity?.message as string}
                    disabled={loading}
                />
            </div>


            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
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
                    size="lg"
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