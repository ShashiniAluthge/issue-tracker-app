import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="mb-4">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`w-full px-3 py-2 border rounded-md  focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none  transition-colors ${error
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500'
                        } ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';