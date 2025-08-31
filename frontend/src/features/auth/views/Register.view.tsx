import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/Register.form';
import { useAuth } from '../hooks/useAuth';

export const RegisterView = () => {
  const { signUp, isLoading, error } = useAuth();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img 
            src="/logo.svg" 
            alt="Orbitask" 
            className="h-12 mx-auto mb-4"
          />
        </div>
        
        <RegisterForm
          onSubmit={signUp}
          error={error}
          isLoading={isLoading}
        />

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login" 
            className="font-medium text-black hover:text-black/80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
