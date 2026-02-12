import React from 'react';
import { SelectFilter } from '../common/SelectFilter';

interface SearchFiltersProps {
    search: string;
    status: string;
    priority: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onPriorityChange: (value: string) => void;
    onClearFilters: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
    search,
    status,
    priority,
    onSearchChange,
    onStatusChange,
    onPriorityChange,
    onClearFilters,
}) => {
    return (
        <div className="bg-white rounded-lg  p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Issues
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search by title..."
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Status Filter */}
                <SelectFilter
                    label="Status"
                    value={status}
                    onChange={onStatusChange}
                    options={[
                        { label: 'All Statuses', value: '' },
                        { label: 'Open', value: 'open' },
                        { label: 'In Progress', value: 'in-progress' },
                        { label: 'Resolved', value: 'resolved' },
                        { label: 'Closed', value: 'closed' },
                    ]}
                />
                {/* Priority Filter */}
                <SelectFilter
                    label="Priority"
                    value={priority}
                    onChange={onPriorityChange}
                    options={[
                        { label: 'All Priorities', value: '' },
                        { label: 'Low', value: 'low' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'High', value: 'high' },
                        { label: 'Critical', value: 'critical' },
                    ]}
                />
            </div>

            {/* Clear Filters Button */}
            {(search || status || priority) && (
                <div className="mt-4">
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
};