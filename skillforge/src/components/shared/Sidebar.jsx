import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { SidebarContent } from './SidebarContent';

/** Fixed sidebar for large screens. Small screens use <MobileNav />. */
export const Sidebar = ({ role }) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-line bg-surface lg:block">
      <SidebarContent role={role} user={user} onLogout={handleLogout} />
    </aside>
  );
};
