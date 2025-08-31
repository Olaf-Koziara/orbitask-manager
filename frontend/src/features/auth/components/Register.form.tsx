import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { RegisterFormProps, RegisterFormData } from '../types/';
import { registerFormSchema } from '../schemas';

export const RegisterForm: React.FC<RegisterFormProps> = ({
    onSubmit,
    isLoading = false,
    error = null,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onFormSubmit = async (data: RegisterFormData) => {
        try {
            await onSubmit(data);
        } catch (submitError) {
            setError('root', {
                type: 'manual',
                message: 'Registration failed. Please try again.',
            });
        }
    };

    return (
        <Card className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-lg border-0 shadow-lg">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tighter">Create Account</h1>
                <p className="text-gray-500">Enter your details to get started</p>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" aria-label="Register form" noValidate>
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        autoComplete="name"
                        {...register('name')}
                        disabled={isLoading}
                        className="w-full bg-white/50"
                    />
                    {errors.name && (
                        <div role="alert" className="text-sm text-red-600">
                            {errors.name.message}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        {...register('email')}
                        disabled={isLoading}
                        className="w-full bg-white/50"
                    />
                    {errors.email && (
                        <div role="alert" className="text-sm text-red-600">
                            {errors.email.message}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...register('password')}
                        disabled={isLoading}
                        className="w-full bg-white/50"
                    />
                    {errors.password && (
                        <div role="alert" className="text-sm text-red-600">
                            {errors.password.message}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...register('confirmPassword')}
                        disabled={isLoading}
                        className="w-full bg-white/50"
                    />
                    {errors.confirmPassword && (
                        <div role="alert" className="text-sm text-red-600">
                            {errors.confirmPassword.message}
                        </div>
                    )}
                </div>

                {(errors.root || error) && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            {errors.root?.message || error}
                        </AlertDescription>
                    </Alert>
                )}

                <Button 
                    type="submit" 
                    className="w-full bg-black hover:bg-black/90 text-white"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </form>
            
            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-black hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </Card>
    );
};