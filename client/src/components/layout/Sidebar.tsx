import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdBugReport } from 'react-icons/md';

interface SidebarProps {
    onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: MdDashboard },
        { name: 'All Issues', path: '/issues', icon: MdBugReport },
    ];

    return (
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
            {/* Logo */}
            <div className="flex items-center h-16 px-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <MdBugReport className="text-white text-xl" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">FixFlow</h1>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onItemClick}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive
                                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50'
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
            <div className="px-6 py-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">© 2026 Issue Tracker</div>
            </div>
        </div>
    );
};
