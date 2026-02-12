export interface Issue {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    severity: 'minor' | 'major' | 'critical';
    user_id: number;
    user_name: string;
    user_email: string;
    created_at: string;
    updated_at: string;
}

export interface IssueStatus {
    total: number;
    open: number | string;
    in_progress: number | string;
    resolved: number | string;
    closed: number | string;
}

export interface IssueFilters {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    severity?: string;
    search?: string;
}

export interface IssuesResponse {
    success: boolean;
    issues: Issue[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}