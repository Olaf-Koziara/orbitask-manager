import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { trpc } from '@/api/trpc';
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { AuthService } from "@/features/auth/services/auth.service";

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setToken,
    setLoading,
    setError,
    signOut: storeSignOut,
    reset,
  } = useAuthStore();

  const { mutate: login } = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      AuthService.saveToken(data.token);
      setLoading(false);
      setError(null);

      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    },
    onError: (error) => {
      setLoading(false);
      setError(error.message);
      reset();
      AuthService.removeToken();
    }
  });

  const { mutate: register } = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      setLoading(false);
      setError(null);

      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    },
    onError: (error) => {
      setLoading(false);
      setError(error.message);
      reset();
      localStorage.removeItem('token');
    }
  });

  useEffect(() => {
    const storedToken = AuthService.getToken();
    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, [token, setToken]);

  const handleRegister = async (data: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    register(data);
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    login(credentials);
  };

  const signOut = () => {
    storeSignOut();
    navigate('/login');
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login: handleLogin,
    signOut,
    register: handleRegister,
  };
};