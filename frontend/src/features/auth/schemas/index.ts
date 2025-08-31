import { z } from 'zod';

export const registerFormSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .trim(),
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
        .min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
export const loginFormSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters'),
});
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
