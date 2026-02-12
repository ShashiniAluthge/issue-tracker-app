import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar for Desktop */}
                <div className="hidden md:flex md:shrink-0">
                    <Sidebar />
                </div>

                {/* Mobile Sidebar Drawer */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 md:hidden flex">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-opacity-50"
                            onClick={() => setSidebarOpen(false)}
                        ></div>

                        {/* Drawer */}
                        <div className="relative flex flex-col w-64 bg-white shadow-lg h-full">

                            {/* Sidebar content */}
                            <Sidebar onItemClick={() => setSidebarOpen(false)} />
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <Navbar onToggleSidebar={() => setSidebarOpen(true)} />
                    <main className="flex-1 overflow-y-auto bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};
