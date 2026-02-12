import React, { useState, useEffect } from 'react';
import { MdClose, MdWarning } from 'react-icons/md';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
    autoConfirm?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'danger',
    autoConfirm = false,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    // Auto-confirm when dialog opens if autoConfirm is true
    useEffect(() => {
        if (isOpen && autoConfirm && !isLoading) {
            // Use setTimeout to avoid flushSync warning
            const timer = setTimeout(() => {
                handleConfirm();
            }, 100); // Small delay to show the dialog first

            return () => clearTimeout(timer);
        }
    }, [isOpen, autoConfirm]);

    // Reset loading state when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setIsLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            icon: 'bg-red-100 text-red-600',
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        },
        warning: {
            icon: 'bg-yellow-100 text-yellow-600',
            button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        },
        info: {
            icon: 'bg-blue-100 text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        },
    };

    const currentStyle = typeStyles[type];

    const handleConfirm = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isLoading) return;

        setIsLoading(true);

        try {
            const result = onConfirm();

            if (result instanceof Promise) {
                await result;
            }
        } catch (error) {
            console.error('Error in confirm action:', error);
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (isLoading) return;
        onCancel();
    };

    // If autoConfirm is true, show a simpler loading dialog
    if (autoConfirm) {
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                />

                {/* Modal */}
                <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all z-50">
                        {/* Content */}
                        <div className="p-8">
                            <div className="flex flex-col items-center justify-center">
                                <div className={`${currentStyle.icon} rounded-full p-4 mb-4`}>
                                    <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                                    {isLoading ? 'Deleting...' : title}
                                </h3>

                                <p className="text-sm text-gray-600 text-center">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Normal confirmation dialog
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
                onClick={isLoading ? undefined : handleCancel}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all z-50">
                    {/* Close button */}
                    {!isLoading && (
                        <button
                            onClick={handleCancel}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <MdClose className="text-xl cursor-pointer" />
                        </button>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        <div className="flex items-center justify-center mb-4">
                            <div className={`${currentStyle.icon} rounded-full p-3`}>
                                <MdWarning className="text-3xl" />
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            {title}
                        </h3>

                        <p className="text-sm text-gray-600 text-center mb-6">{message}</p>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium focus:outline-none focus:ring-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentStyle.button}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Deleting...</span>
                                    </span>
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};