import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormLayout } from '../components/layout/FormLayout';
import { editIssueSchema, type EditIssueFormData } from '../utils/validationSchemas';
import { issueService } from '../services/issueService';
import { IssueForm } from '../components/issues/IssueForm';

export const EditIssuePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EditIssueFormData>({
        resolver: zodResolver(editIssueSchema),
    });

    useEffect(() => {
        const fetchIssue = async () => {
            if (!id) return;

            setFetchLoading(true);
            try {
                const response = await issueService.getIssueById(parseInt(id));
                reset({
                    title: response.issue.title,
                    description: response.issue.description,
                    status: response.issue.status,
                    priority: response.issue.priority,
                    severity: response.issue.severity,
                });
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load issue');
            } finally {
                setFetchLoading(false);
            }
        };

        fetchIssue();
    }, [id, reset]);

    const onSubmit = async (data: EditIssueFormData) => {
        if (!id) return;

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await issueService.updateIssue(parseInt(id), data);
            setSuccessMessage('Issue updated successfully!');

            setTimeout(() => {
                navigate(`/issues/${id}`);
            }, 1500);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Failed to update issue. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="h-96 bg-gray-200 rounded"></div>
                </div>
            </div>

        );
    }

    return (
        <FormLayout
            title="Edit Issue"
            description="Update the issue details below"
            successMessage={successMessage}
            error={error}
        >
            <IssueForm
                mode="edit"
                register={register}
                errors={errors}
                loading={loading}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={() => navigate(`/issues/${id}`)}
            />
        </FormLayout>
    );
};

export default EditIssuePage;