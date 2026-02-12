import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { issueService } from '../services/issueService';
import { type Issue, type IssueFilters, type IssueStatus } from '../types/issue.types';
import { type CreateIssueFormData, type EditIssueFormData } from '../utils/validationSchemas';

interface UseIssueControllerReturn {
    // State
    issue: Issue | null;
    issues: Issue[];
    stats: IssueStatus | null;
    loading: boolean;
    fetchLoading: boolean;
    error: string | null;
    successMessage: string | null;

    // CRUD Operations
    createIssue: (data: CreateIssueFormData, redirectTo?: string) => Promise<void>;
    updateIssue: (id: number, data: EditIssueFormData, redirectTo?: string) => Promise<void>;
    deleteIssue: (id: number, showSuccess?: boolean) => Promise<void>;
    fetchIssue: (id: number) => Promise<Issue>;
    fetchIssues: (filters?: IssueFilters) => Promise<{ issues: Issue[]; pagination: any }>;
    fetchStats: () => Promise<IssueStatus>;

    // State Management
    setIssue: (issue: Issue | null) => void;
    setIssues: (issues: Issue[]) => void;
    setStats: (stats: IssueStatus | null) => void;

    // Utility
    clearError: () => void;
    clearSuccess: () => void;
    setSuccessMessage: (message: string) => void;
    setError: (error: string) => void;
}

export const useIssueController = (): UseIssueControllerReturn => {
    const navigate = useNavigate();

    // State
    const [issue, setIssue] = useState<Issue | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [stats, setStats] = useState<IssueStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Create Issue
    const createIssue = async (data: CreateIssueFormData, redirectTo: string = '/dashboard') => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await issueService.createIssue(data);
            setSuccessMessage('Issue created successfully!');

            setTimeout(() => {
                navigate(redirectTo);
            }, 1500);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create issue. Please try again.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update Issue
    const updateIssue = async (id: number, data: EditIssueFormData) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await issueService.updateIssue(id, data);
            setSuccessMessage('Issue updated successfully!');

            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update issue. Please try again.';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete Issue
    const deleteIssue = async (id: number, showSuccess: boolean = true) => {
        try {
            await issueService.deleteIssue(id);
            if (showSuccess) {
                setSuccessMessage('Issue deleted successfully!');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete issue. Please try again.';
            setError(errorMessage);
            throw err;
        }
    };

    // Fetch Single Issue
    const fetchIssue = async (id: number): Promise<Issue> => {
        setFetchLoading(true);
        setError(null);

        try {
            const response = await issueService.getIssueById(id);
            setIssue(response.issue);
            return response.issue;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to load issue';
            setError(errorMessage);
            throw err;
        } finally {
            setFetchLoading(false);
        }
    };

    // Fetch All Issues
    const fetchIssues = async (filters?: IssueFilters) => {
        setFetchLoading(true);
        setError(null);

        try {
            const response = await issueService.getAllIssues(filters);
            setIssues(response.issues);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to load issues';
            setError(errorMessage);
            throw err;
        } finally {
            setFetchLoading(false);
        }
    };

    // Fetch Stats
    const fetchStats = async (): Promise<IssueStatus> => {
        setFetchLoading(true);
        setError(null);

        try {
            const response = await issueService.getIssueStats();
            setStats(response.stats);
            return response.stats;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to load statistics';
            setError(errorMessage);
            throw err;
        } finally {
            setFetchLoading(false);
        }
    };

    // Utility functions
    const clearError = () => setError(null);
    const clearSuccess = () => setSuccessMessage(null);

    return {
        // State
        issue,
        issues,
        stats,
        loading,
        fetchLoading,
        error,
        successMessage,

        // Operations
        createIssue,
        updateIssue,
        deleteIssue,
        fetchIssue,
        fetchIssues,
        fetchStats,

        // State setters
        setIssue,
        setIssues,
        setStats,

        // Utility
        clearError,
        clearSuccess,
        setSuccessMessage,
        setError,
    };
};