import React from 'react';
import { HiExclamationCircle } from 'react-icons/hi';
import { MdArrowBack } from 'react-icons/md';

interface FormLayoutProps {
    title: string;
    description: string;
    successMessage?: string | null;
    error?: string | null;
    children: React.ReactNode;
}

export const FormLayout: React.FC<FormLayoutProps> = ({
    title,
    description,
    successMessage,
    error,
    children,
}) => {
    return (

        <div className="max-w-4xl  px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center w-10 h-10  hover:bg-gray-50 transition-colors cursor-pointer"
                        aria-label="Go back"
                    >
                        <MdArrowBack className="text-xl text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    </div>
                </div>
                <p className="text-gray-600 ml-14">{description}</p>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                    <svg
                        className="w-5 h-5 text-green-600 mt-0.5 mr-3 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-green-800">{successMessage}</p>
                        <p className="text-sm text-green-600 mt-1">Redirecting...</p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                    <HiExclamationCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {/* Form Content */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
                {children}
            </div>
        </div>

    );
};