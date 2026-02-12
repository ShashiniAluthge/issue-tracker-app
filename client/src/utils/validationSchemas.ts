import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters'),
});

// Register Schema
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(50, 'Name is too long'),
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Invalid email address'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

// Create Issue Schema
export const createIssueSchema = z.object({
    title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(255, 'Title is too long'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description is too long'),
    priority: z.enum(['low', 'medium', 'high', 'critical'], {
        message: 'Please select a valid priority',
    }),
    severity: z.enum(['minor', 'major', 'critical'], {
        message: 'Please select a valid severity',
    }),
});

// Edit Issue Schema
export const editIssueSchema = z.object({
    title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(255, 'Title is too long'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description is too long'),
    status: z.enum(['open', 'in-progress', 'resolved', 'closed']),
    priority: z.enum(['low', 'medium', 'high', 'critical'], {
        message: 'Please select a valid priority',
    }),
    severity: z.enum(['minor', 'major', 'critical'], {
        message: 'Please select a valid severity',
    }),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreateIssueFormData = z.infer<typeof createIssueSchema>;
export type EditIssueFormData = z.infer<typeof editIssueSchema>;