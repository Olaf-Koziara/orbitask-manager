import { LoginForm } from "../components/Login.form";
import { useAuth } from "../hooks/useAuth";

export const LoginView = () => {
  const { login, isLoading, error } = useAuth();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/orbitaskLogo.webp"
            alt="Orbitask"
            className="h-12 mx-auto mb-4"
          />
        </div>

        <LoginForm onSubmit={login} error={error} isLoading={isLoading} />
      </div>
    </div>
  );
};
