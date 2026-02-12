import { useState, useEffect } from 'react';
import { issueService } from '../services/issueService';
import { type Issue } from '../types/issue.types';

interface DeleteDialogState {
    isOpen: boolean;
    issueId: number | null;
    issueTitle: string;
}

export const useAllIssues = (itemsPerPage: number = 10) => {
    // Data State
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [deleting, setDeleting] = useState(false); // Add deleting state

    // Pagination & Filter State
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalIssues, setTotalIssues] = useState(0);

    // Delete Dialog State
    const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
        isOpen: false,
        issueId: null,
        issueTitle: '',
    });

    // Fetch issues with current filters
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

    // Auto-fetch when filters change
    useEffect(() => {
        fetchIssues();
    }, [search, status, priority, currentPage]);

    // Open delete dialog
    const openDeleteDialog = (id: number, title: string) => {
        setDeleteDialog({
            isOpen: true,
            issueId: id,
            issueTitle: title,
        });
    };

    // Close delete dialog
    const closeDeleteDialog = () => {
        setDeleteDialog({
            isOpen: false,
            issueId: null,
            issueTitle: '',
        });
        setDeleting(false); // Reset deleting state
    };

    // Confirm delete - FIXED VERSION
    const confirmDelete = async () => {
        if (!deleteDialog.issueId || deleting) return; // Prevent double deletion

        setDeleting(true); // Set deleting state

        const issueTitle = deleteDialog.issueTitle;
        const issueId = deleteDialog.issueId;

        try {
            await issueService.deleteIssue(issueId);

            // Close dialog
            setDeleteDialog({
                isOpen: false,
                issueId: null,
                issueTitle: '',
            });

            // Refresh list
            await fetchIssues();

            // Show success message
            setSuccessMessage(`Issue "${issueTitle}" deleted successfully!`);
        } catch (error: any) {
            console.error('Delete failed:', error);
            alert('Failed to delete issue. Please try again.');
        } finally {
            setDeleting(false); // Reset deleting state
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setPriority('');
        setCurrentPage(1);
    };

    // Change page
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
        // Data
        issues,
        loading,
        totalPages,
        totalIssues,
        currentPage,
        deleting, // Return deleting state

        // Filters
        search,
        status,
        priority,
        setSearch,
        setStatus,
        setPriority,
        clearFilters,

        // Pagination
        handlePageChange,

        // Delete Dialog
        deleteDialog,
        openDeleteDialog,
        closeDeleteDialog,
        confirmDelete,

        // Messages
        successMessage,
        clearSuccess: () => setSuccessMessage(''),

        // Actions
        refreshIssues: fetchIssues,
    };
};