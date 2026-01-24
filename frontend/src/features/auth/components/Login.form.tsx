import { loginFormSchema } from "@/features/auth/schemas";
import { LoginFormData, LoginFormProps } from "@/features/auth/types";
import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import { Button } from "@/features/shared/components/ui/button";
import { Card } from "@/features/shared/components/ui/card";
import { Input } from "@/features/shared/components/ui/input";
import { Label } from "@/features/shared/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export const LoginForm = ({ onSubmit, error, isLoading }: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const handleFormSubmit = (data: LoginFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-8 glass-card border-white/20 shadow-strong">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to sign in</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            required
            className="bg-white/50 dark:bg-black/20"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            {...register("password")}
            required
            className="bg-white/50 dark:bg-black/20"
          />
        </div>

        {error ||
          ((errors.email || errors.password) && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertDescription>
                {error || errors.email?.message || errors.password?.message}
              </AlertDescription>
            </Alert>
          ))}

        <Button
          type="submit"
          className="w-full shadow-lg shadow-primary/25"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link to="/register">
          <Button variant="link" className="p-0 h-auto font-semibold text-primary">
            Sign up
          </Button>
        </Link>
      </div>
    </Card>
  );
};
