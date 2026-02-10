import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { type IssueStatus } from '../../types/issue.types';

interface StatusChartProps {
    stats: IssueStatus | null;
    loading: boolean;
}

export const StatusChart: React.FC<StatusChartProps> = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-100 rounded"></div>
            </div>
        );
    }

    const data = [
        { name: 'Open', value: Number(stats?.open) || 0, color: '#F59E0B' },  // ✅ Convert to number
        { name: 'In Progress', value: Number(stats?.in_progress) || 0, color: '#8B5CF6' },  // ✅ Convert to number
        { name: 'Resolved', value: Number(stats?.resolved) || 0, color: '#10B981' },  // ✅ Convert to number
        { name: 'Closed', value: Number(stats?.closed) || 0, color: '#6B7280' },  // ✅ Convert to number
    ].filter(item => item.value > 0);

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
                <div className="flex items-center justify-center h-64 text-gray-400">
                    <p>No issues to display</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};