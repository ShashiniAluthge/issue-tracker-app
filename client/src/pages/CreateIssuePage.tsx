import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormLayout } from '../components/layout/FormLayout';
import { createIssueSchema, type CreateIssueFormData } from '../utils/validationSchemas';
import { IssueForm } from '../components/issues/IssueForm';
import { useIssueController } from '../hooks/useIssueController';

export const CreateIssuePage: React.FC = () => {
    const navigate = useNavigate();
    const { createIssue, loading, error, successMessage } = useIssueController();

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
        try {
            await createIssue(data, '/dashboard');
        } catch (err) {
            console.error('Create issue failed:', err);
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