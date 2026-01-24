import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import { Button } from "@/features/shared/components/ui/button";
import { Card } from "@/features/shared/components/ui/card";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { registerFormSchema } from "@/features/auth/schemas";
import { RegisterFormData, RegisterFormProps } from "@/features/auth/types";

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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onFormSubmit = async (data: RegisterFormData) => {
    try {
      await onSubmit(data);
    } catch (submitError) {
      setError("root", {
        type: "manual",
        message: "Registration failed. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-8 glass-card border-white/20 shadow-strong">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
        <p className="text-muted-foreground">Enter your details to get started</p>
      </div>

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-5"
        aria-label="Register form"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            {...register("name")}
            disabled={isLoading}
            className="bg-white/50 dark:bg-black/20"
          />
          {errors.name && (
            <div role="alert" className="text-sm text-destructive">
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
            {...register("email")}
            disabled={isLoading}
            className="bg-white/50 dark:bg-black/20"
          />
          {errors.email && (
            <div role="alert" className="text-sm text-destructive">
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
            {...register("password")}
            disabled={isLoading}
            className="bg-white/50 dark:bg-black/20"
          />
          {errors.password && (
            <div role="alert" className="text-sm text-destructive">
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
            {...register("confirmPassword")}
            disabled={isLoading}
            className="bg-white/50 dark:bg-black/20"
          />
          {errors.confirmPassword && (
            <div role="alert" className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>

        {(errors.root || error) && (
          <Alert variant="destructive" className="animate-fade-in">
            <AlertDescription>{errors.root?.message || error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full shadow-lg shadow-primary/25"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Button variant="link" className="p-0 h-auto font-semibold text-primary" asChild>
          <Link to="/login">
            Sign in
          </Link>
        </Button>
      </div>
    </Card>
  );
};
