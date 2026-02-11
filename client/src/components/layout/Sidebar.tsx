import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    MdDashboard,
    MdBugReport,
    MdAdd,
    MdSettings,
    MdAnalytics
} from 'react-icons/md';
import { HiClipboardList } from 'react-icons/hi';

export const Sidebar: React.FC = () => {
    const menuItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: MdDashboard,
        },
        {
            name: 'All Issues',
            path: '/issues',
            icon: HiClipboardList,
        },
        {
            name: 'Create Issue',
            path: '/issues/create',
            icon: MdAdd,
        },
        {
            name: 'Analytics',
            path: '/analytics',
            icon: MdAnalytics,
        },
        {
            name: 'Settings',
            path: '/settings',
            icon: MdSettings,
        },
    ];

    return (
        <aside className="hidden md:flex md:shrink-0">
            <div className="flex flex-col w-64">
                <div className="flex flex-col grow bg-blue-900 overflow-y-auto">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 px-4 bg-blue-950">
                        <div className="flex items-center space-x-2">
                            <MdBugReport className="text-white text-3xl" />
                            <h1 className="text-xl font-bold text-white">Issue Tracker</h1>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2">
                        {menuItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-blue-800 text-white'
                                            : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                                        }`
                                    }
                                >
                                    <IconComponent className="text-xl mr-3" />
                                    {item.name}
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="px-4 py-4 bg-blue-950">
                        <div className="text-xs text-blue-300 text-center">
                            © 2026 Issue Tracker
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};