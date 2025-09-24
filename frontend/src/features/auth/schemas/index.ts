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

export const updateProfileSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .trim(),
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string()
        .min(1, 'Current password is required'),
    newPassword: z.string()
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
        .min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const deleteAccountSchema = z.object({
    password: z.string()
        .min(1, 'Password is required'),
    confirmation: z.string()
        .min(1, 'Please type DELETE to confirm'),
}).refine((data) => data.confirmation === 'DELETE', {
    message: 'Please type DELETE to confirm',
    path: ['confirmation'],
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type DeleteAccountData = z.infer<typeof deleteAccountSchema>;
