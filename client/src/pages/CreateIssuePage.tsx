import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormLayout } from '../components/layout/FormLayout';
import { createIssueSchema, type CreateIssueFormData } from '../utils/validationSchemas';
import { issueService } from '../services/issueService';
import { IssueForm } from '../components/issues/IssueForm';

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
        <FormLayout
            title="Create New Issue"
            description="Report a new issue or bug for tracking"
            successMessage={successMessage}
            error={error}
        >
            <IssueForm
                mode="create"
                register={register}
                errors={errors}
                loading={loading}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={() => navigate('/dashboard')}
            />
        </FormLayout>
    );
};

export default CreateIssuePage;