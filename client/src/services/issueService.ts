import API from './api';
import { type Issue, type IssueStatus, type IssueFilters } from '../types/issue.types';

export const issueService = {
    // Get all issues with filters
    getAllIssues: async (filters?: IssueFilters) => {
        const params = new URLSearchParams();

        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.status) params.append('status', filters.status);
        if (filters?.priority) params.append('priority', filters.priority);
        if (filters?.severity) params.append('severity', filters.severity);
        if (filters?.search) params.append('search', filters.search);

        const response = await API.get(`/issues?${params.toString()}`);
        return response.data;
    },

    // Get issue statistics
    getIssueStats: async (): Promise<{ success: boolean; stats: IssueStatus }> => {
        const response = await API.get('/issues/status');

        // Convert strings to numbers for consistency
        const transformedStats: IssueStatus = {
            total: Number(response.data.stats.total) || 0,
            open: Number(response.data.stats.open) || 0,
            in_progress: Number(response.data.stats.in_progress) || 0,
            resolved: Number(response.data.stats.resolved) || 0,
            closed: Number(response.data.stats.closed) || 0,
        };

        return {
            success: response.data.success,
            stats: transformedStats,
        };
    },

    // Get single issue
    getIssueById: async (id: number) => {
        const response = await API.get(`/issues/${id}`);
        return response.data;
    },

    // Create issue
    createIssue: async (data: Partial<Issue>) => {
        const response = await API.post('/issues', data);
        return response.data;
    },

    // Update issue
    updateIssue: async (id: number, data: Partial<Issue>) => {
        const response = await API.put(`/issues/${id}`, data);
        return response.data;
    },

    // Delete issue
    deleteIssue: async (id: number) => {
        const response = await API.delete(`/issues/${id}`);
        return response.data;
    },
};