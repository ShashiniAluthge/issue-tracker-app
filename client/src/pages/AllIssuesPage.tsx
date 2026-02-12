import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { IssuesTable } from '../components/dashboard/IssuesTable';
import { SearchFilters } from '../components/dashboard/SearchFilters';
import { issueService } from '../services/issueService';
import { type Issue } from '../types/issue.types';
import { MdAdd, MdRefresh } from 'react-icons/md';
import { Button } from '../components/common/Button';
import { Pagination } from '../components/common/Pagination';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Alert } from '../components/common/Alert';
import { exportToCSV } from '../utils/exportCsv';
import { printIssues } from '../utils/printIssues';

export const AllIssuesPage: React.FC = () => {
    const navigate = useNavigate();
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters and Pagination
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalIssues, setTotalIssues] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');
    const itemsPerPage = 10;

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

    // Fetch issues with pagination and filters
    const fetchIssues = async () => {
        setLoading(true);
        try {
            const filters = {
                search: search || undefined,
                status: status || undefined,
                priority: priority || undefined,
                page: currentPage,
                limit: itemsPerPage,
            };
            const response = await issueService.getAllIssues(filters);
            setIssues(response.issues);
            setTotalPages(response.pagination.totalPages);
            setTotalIssues(response.pagination.total);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, [search, status, priority, currentPage]);

    const handleViewIssue = (id: number) => {
        navigate(`/issues/${id}`);
    };

    const handleEditIssue = (id: number) => {
        navigate(`/issues/${id}/edit`);
    };

    const handleDeleteIssue = (id: number) => {
        const issue = issues.find((i) => i.id === id);

        setDeleteDialog({
            isOpen: true,
            issueId: id,
            issueTitle: issue?.title || 'this issue',
        });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.issueId) return;

        const issueTitle = deleteDialog.issueTitle;

        await issueService.deleteIssue(deleteDialog.issueId);
        setDeleteDialog({ isOpen: false, issueId: null, issueTitle: '' });

        await fetchIssues();

        setSuccessMessage(`Issue "${issueTitle}" deleted successfully!`);
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('');
        setPriority('');
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle print
    const handlePrint = () => {
        printIssues(issues, {
            search: search || undefined,
            status: status || undefined,
            priority: priority || undefined,
        });
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">All Issues</h1>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={fetchIssues}
                                variant="outline"
                                size="md"
                                className="border-gray-300 text-gray-700 cursor-pointer"
                            >
                                <MdRefresh className="mr-2 text-lg" />
                                Refresh
                            </Button>
                            <Button
                                onClick={() => navigate('/issues/create')}
                                variant="primary"
                                size="md"
                                className="cursor-pointer"
                            >
                                <MdAdd className="mr-2 text-lg" />
                                New Issue
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <SearchFilters
                    search={search}
                    status={status}
                    priority={priority}
                    onSearchChange={setSearch}
                    onStatusChange={setStatus}
                    onPriorityChange={setPriority}
                    onClearFilters={handleClearFilters}
                />

                {/* Issues Section Header */}
                <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Issues List</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {loading ? (
                                'Loading...'
                            ) : (
                                <>
                                    Showing {issues.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                                    {Math.min(currentPage * itemsPerPage, totalIssues)} of {totalIssues} issues
                                </>
                            )}
                        </p>
                    </div>

                    {/* Actions Menu */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => exportToCSV(issues, `issues_${new Date().toISOString()}.csv`)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center"
                            disabled={issues.length === 0}
                        >
                            <svg
                                className="w-4 h-4 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Export CSV
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center"
                            disabled={issues.length === 0}
                        >
                            <svg
                                className="w-4 h-4 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                />
                            </svg>
                            Print
                        </button>
                    </div>
                </div>

                {/* Issues Table*/}
                <IssuesTable
                    issues={issues}
                    loading={loading}
                    onViewIssue={handleViewIssue}
                    onEditIssue={handleEditIssue}
                    onDeleteIssue={handleDeleteIssue}
                />

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}

                {/* No results after filtering */}
                {!loading && issues.length === 0 && (search || status || priority) && (
                    <div className="mt-8 bg-white rounded-lg shadow-md p-12 text-center">
                        <svg
                            className="mx-auto h-16 w-16 text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No issues found matching your filters
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Try adjusting your search criteria or clearing the filters
                        </p>
                        <Button onClick={handleClearFilters} variant="outline" size="md">
                            Clear All Filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Deleting Issue"
                message={`Deleting "${deleteDialog.issueTitle}"...`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog({ isOpen: false, issueId: null, issueTitle: '' })}
                type="danger"
                autoConfirm={true}
            />

            {/* Success Alert Toast */}
            {successMessage && (
                <Alert
                    type="success"
                    message={successMessage}
                    onClose={() => setSuccessMessage('')}
                    isToast={true}
                    duration={3000}
                />
            )}
        </Layout>
    );
};

export default AllIssuesPage;