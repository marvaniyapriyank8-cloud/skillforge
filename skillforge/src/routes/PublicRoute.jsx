import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROLE_HOME } from '../utils/ui';

/** Auth pages: signed-in users are sent straight to their dashboard. */
export const PublicRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  if (!isAuthenticated || !user) return <Outlet />;
  return <Navigate to={ROLE_HOME[user.role] || '/'} replace />;
};
