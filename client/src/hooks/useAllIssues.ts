import { useState, useEffect } from 'react';
import { issueService } from '../services/issueService';
import { type Issue } from '../types/issue.types';
import { printIssues } from '../utils/printIssues';
import { exportToCSV } from '../utils/exportCsv';


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
    const [deleting, setDeleting] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

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
        setDeleting(false);
    };

    // Confirm delete 
    const confirmDelete = async () => {
        if (!deleteDialog.issueId || deleting) return; // Prevent double deletion

        setDeleting(true);

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
            setDeleting(false);
        }
    };

    // Fetch all issues for printing/export
    const fetchAllForPrint = async () => {
        try {
            const filters = {
                search: search || undefined,
                status: status || undefined,
                priority: priority || undefined,
                page: 1,
                limit: totalIssues || 1000,
            };

            const response = await issueService.getAllIssues(filters);
            return response.issues;
        } catch (error) {
            console.error('Error fetching all issues for print:', error);
            return [];
        }
    };

    // Handle print with loading state
    const handlePrint = async () => {
        setIsPrinting(true);
        try {
            const allIssues = await fetchAllForPrint();
            printIssues(allIssues, { search, status, priority });
        } catch (error) {
            console.error('Print failed:', error);
            alert('Failed to load issues for printing');
        } finally {
            setIsPrinting(false);
        }
    };

    //handle export to CSV
    const handleExportCSV = async () => {
        const allIssues = await fetchAllForPrint();
        exportToCSV(allIssues, `issues_${new Date().toISOString()}.csv`);
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
        deleting,
        isPrinting,

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

        //print & export
        handlePrint,
        handleExportCSV,

        // Messages
        successMessage,
        clearSuccess: () => setSuccessMessage(''),

        // Actions
        refreshIssues: fetchIssues,
    };
};