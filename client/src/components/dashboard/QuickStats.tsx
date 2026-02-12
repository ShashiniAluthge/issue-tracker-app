import React from 'react';
import { type IssueStatus } from '../../types/issue.types';

interface QuickStatsProps {
    stats: IssueStatus | null;
    loading: boolean;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 border border-gray-200 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="space-y-3">
                    <div className="h-10 bg-gray-100 rounded"></div>
                    <div className="h-10 bg-gray-100 rounded"></div>
                    <div className="h-10 bg-gray-100 rounded"></div>
                    <div className="h-12 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    const totalIssues = Number(stats?.total) || 0;
    const resolvedIssues = Number(stats?.resolved) || 0;
    const closedIssues = Number(stats?.closed) || 0;
    const openIssues = Number(stats?.open) || 0;
    const inProgressIssues = Number(stats?.in_progress) || 0;

    const completionRate = totalIssues
        ? Math.round(((resolvedIssues + closedIssues) / totalIssues) * 100)
        : 0;

    const activeIssues = openIssues + inProgressIssues;

    return (
        <div className="lg:col-span-2 bg-white rounded-lg  p-4 border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-3">
                {/* Total Issues */}
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-xs text-gray-600">Total Issues</span>
                    <span className="text-base font-bold text-gray-900">
                        {totalIssues}
                    </span>
                </div>

                {/* Completion Rate */}
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-xs text-gray-600">Completion Rate</span>
                    <span className="text-base font-bold text-green-600">
                        {completionRate}%
                    </span>
                </div>

                {/* Active Issues */}
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-xs text-gray-600">Active Issues</span>
                    <span className="text-base font-bold text-yellow-600">
                        {activeIssues}
                    </span>
                </div>

                {/* Issue Resolution Progress Bar */}
                <div className="pt-1">
                    <div className="text-xs text-gray-500 mb-2">Issue Resolution</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className="bg-green-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${completionRate}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};