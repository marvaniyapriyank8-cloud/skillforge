import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Avatar } from '../ui/Avatar';
import { ThemeToggle } from '../ui/ThemeToggle';
import { cn } from '../../utils/cn';
import { navConfig } from './navConfig';

/** Navigation + account block, shared by the desktop sidebar and the mobile drawer. */
export const SidebarContent = ({ role, user, onNavigate, onLogout }) => {
  const links = navConfig[role] || [];
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center px-5">
        <Logo />
      </div>

      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-0.5">
          {links.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-brand-soft text-brand-fg' : 'text-fg-muted hover:bg-subtle hover:text-fg'
                  )
                }
              >
                <Icon size={18} aria-hidden="true" className="shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-line p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={user?.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-fg">{user?.name}</p>
            <p className="truncate text-xs capitalize text-fg-subtle">{role}</p>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-1">
          <button
            type="button"
            onClick={onLogout}
            className="flex flex-1 items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
          >
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
