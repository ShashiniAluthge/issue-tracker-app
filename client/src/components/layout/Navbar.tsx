import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { MdLogout, MdMenu } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';

interface NavbarProps {
    onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <nav className="bg-white  sticky top-0 z-10 border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={onToggleSidebar}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <MdMenu className="text-2xl" />
                        </button>
                    </div>

                    {/* Spacer for desktop */}
                    <div className="hidden md:block"></div>

                    {/* User Menu - Always on the right */}
                    <div className="relative ml-auto">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 focus:outline-none cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <FaUserCircle className="text-3xl text-gray-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                                <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                                    <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer"
                                >
                                    <MdLogout className="text-lg" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};