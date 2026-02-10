import React from 'react';
import { type IssueStatus } from '../../types/issue.types';
import { HiClipboardList } from 'react-icons/hi';
import { MdLockOpen } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';

interface StatusCardsProps {
    status: IssueStatus | null;
    loading: boolean;
}

export const StatusCards: React.FC<StatusCardsProps> = ({ status, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: 'Total Issues',
            value: Number(status?.total) || 0,
            icon: HiClipboardList,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Open',
            value: Number(status?.open) || 0,
            icon: MdLockOpen,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-700',
            iconColor: 'text-yellow-500',
        },
        {
            title: 'In Progress',
            value: Number(status?.in_progress) || 0,
            icon: FaSpinner,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
            iconColor: 'text-purple-500',
        },
        {
            title: 'Resolved',
            value: Number(status?.resolved) || 0,
            icon: IoMdCheckmarkCircle,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            iconColor: 'text-green-500',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                                <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                            </div>
                            <div className={`${card.bgColor} p-3 rounded-full`}>
                                <IconComponent className={`text-3xl ${card.iconColor}`} />
                            </div>
                        </div>
                        <div className={`mt-4 h-1 ${card.color} rounded-full`}></div>
                    </div>
                );
            })}
        </div>
    );
};