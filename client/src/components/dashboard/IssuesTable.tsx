import React from 'react';
import { type Issue } from '../../types/issue.types';
import { formatDistanceToNow } from 'date-fns';
import { MdOutlineVisibility } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

interface IssuesTableProps {
    issues: Issue[];
    loading: boolean;
    onViewIssue: (id: number) => void;
    onEditIssue?: (id: number) => void;
    onDeleteIssue?: (id: number) => void;
}

export const IssuesTable: React.FC<IssuesTableProps> = ({
    issues,
    loading,
    onViewIssue,
    onEditIssue,
    onDeleteIssue
}) => {
    const getStatusBadge = (status: string) => {
        const statusStyles = {
            open: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'in-progress': 'bg-purple-100 text-purple-800 border-purple-300',
            resolved: 'bg-green-100 text-green-800 border-green-300',
            closed: 'bg-gray-100 text-gray-800 border-gray-300',
        };
        return statusStyles[status as keyof typeof statusStyles] || statusStyles.open;
    };

    const getPriorityBadge = (priority: string) => {
        const priorityStyles = {
            low: 'bg-blue-100 text-blue-800 border-blue-300',
            medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            high: 'bg-orange-100 text-orange-800 border-orange-300',
            critical: 'bg-red-100 text-red-800 border-red-300',
        };
        return priorityStyles[priority as keyof typeof priorityStyles] || priorityStyles.medium;
    };

    const handleDelete = (id: number, title: string) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            onDeleteIssue?.(id);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (issues.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Issue
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {issues.map((issue) => (
                            <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">
                                            {issue.title}
                                        </span>
                                        <span className="text-sm text-gray-500 truncate max-w-md">
                                            {issue.description}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(
                                            issue.status
                                        )}`}
                                    >
                                        {issue.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPriorityBadge(
                                            issue.priority
                                        )}`}
                                    >
                                        {issue.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-900">{issue.user_name}</span>
                                        <span className="text-xs text-gray-500">{issue.user_email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        {/* View Icon */}
                                        <button
                                            onClick={() => onViewIssue(issue.id)}
                                            className="text-gray-500 hover:text-gray-900 transition-colors p-1 hover:bg-gray-100 rounded cursor-pointer"
                                            title="View issue"
                                        >
                                            <MdOutlineVisibility className="text-base" />
                                        </button>

                                        {/* Edit Icon */}
                                        {onEditIssue && (
                                            <button
                                                onClick={() => onEditIssue(issue.id)}
                                                className="text-gray-500 hover:text-gray-900 transition-colors p-1 hover:bg-gray-100 rounded cursor-pointer"
                                                title="Edit issue"
                                            >
                                                <FaRegEdit className="text-sm" />
                                            </button>
                                        )}

                                        {/* Delete Icon */}
                                        {onDeleteIssue && (
                                            <button
                                                onClick={() => handleDelete(issue.id, issue.title)}
                                                className="text-red-400 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded cursor-pointer"
                                                title="Delete issue"
                                            >
                                                <RiDeleteBin6Line className="text-sm" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};