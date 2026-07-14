import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const roleHome = { student: '/student/dashboard', recruiter: '/recruiter/dashboard', mentor: '/mentor/dashboard', admin: '/admin/dashboard' };
    return <Navigate to={roleHome[user?.role] || '/login'} replace />;
  }
  return <Outlet />;
};
