import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "../../shared/components/ui/alert";
import { Button } from "../../shared/components/ui/button";
import { Card } from "../../shared/components/ui/card";
import { Input } from "../../shared/components/ui/input";
import { Label } from "../../shared/components/ui/label";
import { loginFormSchema } from "../schemas";
import { LoginFormData, LoginFormProps } from "../types";

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
    <Card className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-lg border-0 shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter">Welcome back</h1>
        <p className="text-gray-500">Enter your credentials to sign in</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            required
            className="w-full bg-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            required
            className="w-full bg-white/50"
          />
        </div>

        {error ||
          ((errors.email || errors.password) && (
            <Alert variant="destructive">
              <AlertDescription>
                {error || errors.email?.message || errors.password?.message}
              </AlertDescription>
            </Alert>
          ))}

        <Button
          type="submit"
          className="w-full bg-black hover:bg-black/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <Link to="/register" className="text-center mt-4 text-sm">
        <Button className="mt-2 w-full bg-white border border-black hover:bg-black/90 hover:text-white text-black">
          Sign up
        </Button>
      </Link>
      <div className="text-center text-sm">
        <a href="/forgot-password" className="text-gray-600 hover:text-black">
          Forgot your password?
        </a>
      </div>
    </Card>
  );
};
