import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssueController } from './useIssueController';

interface DeleteDialogState {
    isOpen: boolean;
    issueId: number | null;
    issueTitle: string;
}

export const useIssueDetail = (issueId: number) => {
    const navigate = useNavigate();
    const controller = useIssueController();

    const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
        isOpen: false,
        issueId: null,
        issueTitle: '',
    });

    // Fetch issue on mount
    useEffect(() => {
        controller.fetchIssue(issueId);
    }, [issueId]);

    // Open delete dialog
    const openDeleteDialog = () => {
        if (!controller.issue) return;

        setDeleteDialog({
            isOpen: true,
            issueId: controller.issue.id,
            issueTitle: controller.issue.title,
        });
    };

    // Close delete dialog
    const closeDeleteDialog = () => {
        setDeleteDialog({
            isOpen: false,
            issueId: null,
            issueTitle: '',
        });
    };

    // Confirm delete
    const confirmDelete = async () => {
        if (!deleteDialog.issueId) return;

        const issueTitle = deleteDialog.issueTitle;

        try {
            await controller.deleteIssue(deleteDialog.issueId, false);
            closeDeleteDialog();
            controller.setSuccessMessage(`Issue "${issueTitle}" deleted successfully!`);

            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    return {
        // Issue data
        issue: controller.issue,
        loading: controller.loading,
        error: controller.error,
        successMessage: controller.successMessage,

        // Delete dialog
        deleteDialog,
        openDeleteDialog,
        closeDeleteDialog,
        confirmDelete,

        // Utility
        clearSuccess: controller.clearSuccess,
    };
};