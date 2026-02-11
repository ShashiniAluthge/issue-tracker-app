import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { StatusCards } from '../components/dashboard/StatusCards';
import { StatusChart } from '../components/dashboard/StatusChart';
import { QuickStats } from '../components/dashboard/QuickStats';
import { IssuesTable } from '../components/dashboard/IssuesTable';
import { useAuthStore } from '../store/authStore';
import { issueService } from '../services/issueService';
import { type Issue, type IssueStatus } from '../types/issue.types';
import { MdAdd, MdRefresh, MdArrowForward } from 'react-icons/md';
import { Button } from '../components/common/Button';

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore(); // Get user info for personalized greeting
    const [stats, setStats] = useState<IssueStatus | null>(null);
    const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    // Fetch statistics
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

    // Fetch only recent 10 issues
    const fetchRecentIssues = async () => {
        setLoading(true);
        try {
            const response = await issueService.getAllIssues({
                page: 1,
                limit: 10,
            });
            setRecentIssues(response.issues);
        } catch (error) {
            console.error('Error fetching recent issues:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchRecentIssues();
    }, []);

    const handleViewIssue = (id: number) => {
        navigate(`/issues/${id}`);
    };

    const handleEditIssue = (id: number) => {
        navigate(`/issues/${id}/edit`);
    };

    const handleDeleteIssue = async (id: number) => {
        try {
            await issueService.deleteIssue(id);
            fetchStats();
            fetchRecentIssues();
        } catch (error) {
            console.error('Error deleting issue:', error);
            alert('Failed to delete issue. Please try again.');
        }
    };

    const handleRefresh = () => {
        fetchStats();
        fetchRecentIssues();
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header - Personalized Greeting */}
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        {getGreeting()}, {user?.name || 'User'}!
                    </h1>

                </div>

                {/* Statistics Cards */}
                <StatusCards status={stats} loading={statsLoading} />

                {/* Status Chart*/}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                    <div className="lg:col-span-3">
                        <StatusChart stats={stats} loading={statsLoading} />
                    </div>
                    <QuickStats stats={stats} loading={statsLoading} />
                </div>

                {/* Recent Issues Section*/}
                <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Recent Issues</h2>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            onClick={handleRefresh}
                            variant="outline"
                            size="sm"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            <MdRefresh className="mr-1.5 text-base" />
                            Refresh
                        </Button>
                        <Button
                            onClick={() => navigate('/issues/create')}
                            variant="primary"
                            size="sm"
                            className='cursor-pointer'
                        >
                            <MdAdd className="mr-1.5 text-base" />
                            New Issue
                        </Button>
                        <Button
                            onClick={() => navigate('/issues')}
                            variant="outline"
                            size="sm"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer"
                        >
                            View All
                            <MdArrowForward className="ml-1.5 text-base" />
                        </Button>
                    </div>
                </div>

                {/* Recent Issues Table */}
                <IssuesTable
                    issues={recentIssues}
                    loading={loading}
                    onViewIssue={handleViewIssue}
                    onEditIssue={handleEditIssue}
                    onDeleteIssue={handleDeleteIssue}
                />

                {/*view all issues action */}
                {!loading && recentIssues.length === 10 && (
                    <div className="mt-6 text-center">
                        <Button
                            onClick={() => navigate('/issues')}
                            variant="outline"
                            size="md"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            View All Issues
                            <MdArrowForward className="ml-2 text-lg" />
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">
                            There are more issues to explore
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default DashboardPage;