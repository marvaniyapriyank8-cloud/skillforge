import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const PublicRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user) return <Outlet />;
  const routes = { student: '/student/dashboard', recruiter: '/recruiter/dashboard', mentor: '/mentor/dashboard', admin: '/admin/dashboard' };
  return <Navigate to={routes[user.role] || '/'} replace />;
};
