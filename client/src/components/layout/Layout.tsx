import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MdClose } from 'react-icons/md';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar for Desktop */}
                <Sidebar />

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 md:hidden">
                        <div
                            className="fixed inset-0 bg-gray-600 bg-opacity-75"
                            onClick={() => setSidebarOpen(false)}
                        ></div>
                        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-blue-900">
                            <div className="flex items-center justify-between h-16 px-4 bg-blue-950">
                                <h1 className="text-xl font-bold text-white">Issue Tracker</h1>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="text-white hover:text-gray-200"
                                >
                                    <MdClose className="text-2xl" />
                                </button>
                            </div>
                            {/* Mobile nav items would go here - reuse Sidebar content */}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <main className="flex-1 overflow-y-auto bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};