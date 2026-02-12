import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { issueService } from '../services/issueService';
import { type Issue } from '../types/issue.types';
import { MdArrowBack } from 'react-icons/md';
import { Button } from '../components/common/Button';
import { formatDistanceToNow } from 'date-fns';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaRegEdit } from 'react-icons/fa';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Alert } from '../components/common/Alert';

export const IssueDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [issue, setIssue] = useState<Issue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    // Delete dialog state
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        issueId: number | null;
        issueTitle: string;
    }>({
        isOpen: false,
        issueId: null,
        issueTitle: '',
    });
    useEffect(() => {
        const fetchIssue = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response = await issueService.getIssueById(parseInt(id));
                setIssue(response.issue);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load issue');
            } finally {
                setLoading(false);
            }
        };

        fetchIssue();
    }, [id]);

    const handleDelete = () => {
        if (!issue) return;

        setDeleteDialog({
            isOpen: true,
            issueId: issue.id,
            issueTitle: issue.title,
        });
    };
    const confirmDelete = async () => {
        if (!deleteDialog.issueId) return;

        const issueTitle = deleteDialog.issueTitle;

        try {
            await issueService.deleteIssue(deleteDialog.issueId);

            // Close dialog
            setDeleteDialog({
                isOpen: false,
                issueId: null,
                issueTitle: '',
            });

            setSuccessMessage(
                `Issue "${issueTitle}" deleted successfully!`
            );

            setTimeout(() => {
                navigate(-1);//go back
            }, 1500);

        } catch (error) {
            console.error(error);
        }
    };



    const getStatusBadge = (status: string) => {
        const styles = {
            open: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'in-progress': 'bg-purple-100 text-purple-800 border-purple-300',
            resolved: 'bg-green-100 text-green-800 border-green-300',
            closed: 'bg-gray-100 text-gray-800 border-gray-300',
        };
        return styles[status as keyof typeof styles] || styles.open;
    };

    const getPriorityBadge = (priority: string) => {
        const styles = {
            low: 'bg-blue-100 text-blue-800 border-blue-300',
            medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            high: 'bg-orange-100 text-orange-800 border-orange-300',
            critical: 'bg-red-100 text-red-800 border-red-300',
        };
        return styles[priority as keyof typeof styles] || styles.medium;
    };

    const getSeverityBadge = (severity: string) => {
        const styles = {
            minor: 'bg-blue-100 text-blue-800 border-blue-300',
            major: 'bg-orange-100 text-orange-800 border-orange-300',
            critical: 'bg-red-100 text-red-800 border-red-300',
        };
        return styles[severity as keyof typeof styles] || styles.major;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 h-96"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !issue) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                        <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Issue</h2>
                        <p className="text-red-600 mb-4">{error || 'Issue not found'}</p>
                        <Button onClick={() => navigate('/dashboard')} variant="outline">
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className=" px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group cursor-pointer"
                    >
                        <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />

                    </button>
                </div>

                {/* Header Section */}
                <div className="bg-white rounded-lg  border border-gray-200 mb-6">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{issue.title}</h1>
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                            <span className="font-medium">Issue #{issue.id}</span>
                                            <span>•</span>
                                            <span>Created {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}</span>
                                            <span>•</span>
                                            <span>by <span className="font-medium text-gray-700">{issue.user_name}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 lg:shrink-0">
                                <Button
                                    onClick={() => navigate(`/issues/${issue.id}/edit`)}
                                    variant="outline"
                                    size="md"
                                    className="border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"
                                >
                                    <FaRegEdit className="text-lg mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    variant="danger"
                                    size="md"
                                    className='cursor-pointer'
                                >
                                    <RiDeleteBin6Line className="text-lg mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Status</p>
                                <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full border ${getStatusBadge(issue.status)}`}>
                                    {issue.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Priority</p>
                                <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full border ${getPriorityBadge(issue.priority)}`}>
                                    {issue.priority}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Severity</p>
                                <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full border ${getSeverityBadge(issue.severity)}`}>
                                    {issue.severity}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-lg  border border-gray-200 mb-6">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            Description
                        </h2>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{issue.description}</p>
                        </div>
                    </div>
                </div>

                {/* Metadata Section */}
                <div className="bg-white rounded-lg  border border-gray-200">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Issue Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created By</p>
                                <p className="text-sm font-semibold text-gray-900">{issue.user_name}</p>
                                <p className="text-xs text-gray-500 mt-1">{issue.user_email}</p>
                            </div>
                            <div className="border-l-4 border-green-500 pl-4">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created At</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {new Date(issue.created_at).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(issue.created_at).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-4">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Updated</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {new Date(issue.updated_at).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(issue.updated_at).toLocaleTimeString()}
                                </p>
                            </div>
                            <div className="border-l-4 border-purple-500 pl-4">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Issue ID</p>
                                <p className="text-sm font-semibold text-gray-900">#{issue.id}</p>
                                <p className="text-xs text-gray-500 mt-1">Unique identifier</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Issue"
                message={`Are you sure you want to delete "${deleteDialog.issueTitle}"?`}
                onConfirm={confirmDelete}
                onCancel={() =>
                    setDeleteDialog({ isOpen: false, issueId: null, issueTitle: '' })
                }
                type="danger"
            />

            {successMessage && (
                <Alert
                    type="success"
                    message={successMessage}
                    onClose={() => setSuccessMessage('')}
                    isToast={true}
                    duration={3000}
                />
            )}


        </div>
    );
};

export default IssueDetailPage;