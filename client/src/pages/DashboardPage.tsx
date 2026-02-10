import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { StatusCards } from '../components/dashboard/StatusCards';
import { StatusChart } from '../components/dashboard/StatusChart';
import { IssuesTable } from '../components/dashboard/IssuesTable';
import { SearchFilters } from '../components/dashboard/SearchFilters';
import { issueService } from '../services/issueService';
import { type Issue, type IssueStatus } from '../types/issue.types';

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<IssueStatus | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const response = await issueService.getIssueStats();
            setStats(response.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const filters = {
                search: search || undefined,
                status: status || undefined,
                priority: priority || undefined,
                limit: 100,
            };
            const response = await issueService.getAllIssues(filters);
            setIssues(response.issues);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchIssues();
    }, [search, status, priority]);

    const handleViewIssue = (id: number) => {
        navigate(`/issues/${id}`);
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('');
        setPriority('');
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Overview of all issues and their status</p>
                </div>

                <StatusCards status={stats} loading={statsLoading} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <StatusChart stats={stats} loading={statsLoading} />
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/issues/create')}
                                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Create New Issue</span>
                            </button>
                            <button
                                onClick={() => fetchIssues()}
                                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Refresh Data</span>
                            </button>
                        </div>
                    </div>
                </div>

                <SearchFilters
                    search={search}
                    status={status}
                    priority={priority}
                    onSearchChange={setSearch}
                    onStatusChange={setStatus}
                    onPriorityChange={setPriority}
                    onClearFilters={handleClearFilters}
                />

                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">All Issues</h2>
                    <span className="text-sm text-gray-500">
                        {issues.length} {issues.length === 1 ? 'issue' : 'issues'} found
                    </span>
                </div>
                <IssuesTable issues={issues} loading={loading} onViewIssue={handleViewIssue} />
            </div>
        </Layout>
    );
};

export default DashboardPage;