import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { StatusCards } from '../components/dashboard/StatusCards';
import { StatusChart } from '../components/dashboard/StatusChart';
import { IssuesTable } from '../components/dashboard/IssuesTable';

import { issueService } from '../services/issueService';
import { type Issue, type IssueStatus } from '../types/issue.types';
import { MdAdd, MdRefresh, MdArrowForward } from 'react-icons/md';
import { Button } from '../components/common/Button';

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<IssueStatus | null>(null);
    const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);

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
                limit: 10, // Only fetch 10 most recent issues
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

    const handleRefresh = () => {
        fetchStats();
        fetchRecentIssues();
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600 mt-2">Overview of all issues and their status</p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleRefresh}
                                variant="outline"
                                size="md"
                                className="border-gray-300 text-gray-700"
                            >
                                <MdRefresh className="mr-2 text-lg" />
                                Refresh
                            </Button>
                            <Button
                                onClick={() => navigate('/issues/create')}
                                variant="primary"
                                size="md"
                            >
                                <MdAdd className="mr-2 text-lg" />
                                New Issue
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards - Reduced Size */}
                <StatusCards status={stats} loading={statsLoading} />

                {/* Chart Section - Reduced Size */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Chart - Takes 2 columns - Reduced Size */}
                    <div className="lg:col-span-2">
                        <StatusChart stats={stats} loading={statsLoading} />
                    </div>

                    {/* Quick Stats Card - Takes 1 column - Reduced Size */}
                    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-xs text-gray-600">Total Issues</span>
                                <span className="text-base font-bold text-gray-900">
                                    {Number(stats?.total) || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-xs text-gray-600">Completion Rate</span>
                                <span className="text-base font-bold text-green-600">
                                    {stats?.total
                                        ? Math.round(
                                            ((Number(stats.resolved) + Number(stats.closed)) /
                                                Number(stats.total)) *
                                            100
                                        )
                                        : 0}
                                    %
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-xs text-gray-600">Active Issues</span>
                                <span className="text-base font-bold text-yellow-600">
                                    {Number(stats?.open || 0) + Number(stats?.in_progress || 0)}
                                </span>
                            </div>
                            <div className="pt-1">
                                <div className="text-xs text-gray-500 mb-2">Issue Resolution</div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-green-500 h-1.5 rounded-full transition-all"
                                        style={{
                                            width: `${stats?.total
                                                ? Math.round(
                                                    ((Number(stats.resolved) +
                                                        Number(stats.closed)) /
                                                        Number(stats.total)) *
                                                    100
                                                )
                                                : 0
                                                }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Issues Section Header */}
                <div className="mb-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Recent Issues</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Showing the 10 most recent issues
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate('/issues')}
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                        View All Issues
                        <MdArrowForward className="ml-2 text-lg" />
                    </Button>
                </div>

                {/* Recent Issues Table */}
                <IssuesTable issues={recentIssues} loading={loading} onViewIssue={handleViewIssue} />

                {/* Call to Action - View All Issues */}
                {!loading && recentIssues.length === 10 && (
                    <div className="mt-6 text-center">
                        <Button
                            onClick={() => navigate('/issues')}
                            variant="outline"
                            size="md"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
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