import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthStore } from '../stores/auth.store';

const PrivateRoute = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;