import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormLayout } from '../components/layout/FormLayout';
import { editIssueSchema, type EditIssueFormData } from '../utils/validationSchemas';
import { IssueForm } from '../components/issues/IssueForm';
import { useIssueController } from '../hooks/useIssueController';

export const EditIssuePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { issue, updateIssue, fetchIssue, loading, fetchLoading, error, successMessage } =
        useIssueController();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<EditIssueFormData>({
        resolver: zodResolver(editIssueSchema),
    });

    useEffect(() => {
        if (id) {
            fetchIssue(parseInt(id));
        }
    }, [id]);

    useEffect(() => {
        if (issue) {
            reset({
                title: issue.title,
                description: issue.description,
                status: issue.status,
                priority: issue.priority,
                severity: issue.severity,
            });
        }
    }, [issue, reset]);

    const onSubmit = async (data: EditIssueFormData) => {
        if (!id) return;

        try {
            await updateIssue(parseInt(id), data);
        } catch (err) {
            console.error('Update issue failed:', err);
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
                watch={watch}
                setValue={setValue}
                errors={errors}
                loading={loading}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={() => navigate(-1)}
            />
        </FormLayout>
    );
};

export default EditIssuePage;