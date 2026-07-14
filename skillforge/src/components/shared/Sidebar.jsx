import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, Code2, FolderGit2, FileText, Briefcase,
  ClipboardList, Users, MessageSquare, BarChart3, Shield, Menu, X,
  LogOut, Zap, ChevronLeft, Bell, Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navConfig = {
  student: [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/profile',   icon: User,            label: 'Profile' },
    { to: '/student/skills',    icon: Code2,           label: 'Skills' },
    { to: '/student/projects',  icon: FolderGit2,      label: 'Projects' },
    { to: '/student/resume',    icon: FileText,        label: 'Resume & AI' },
    { to: '/student/jobs',      icon: Briefcase,       label: 'Browse Jobs' },
    { to: '/student/applications', icon: ClipboardList, label: 'Applications' },
  ],
  recruiter: [
    { to: '/recruiter/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/recruiter/jobs',       icon: Briefcase,       label: 'Manage Jobs' },
    { to: '/recruiter/applicants', icon: Users,           label: 'Applicants' },
  ],
  mentor: [
    { to: '/mentor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/mentor/feedback',  icon: MessageSquare,   label: 'Feedback' },
  ],
  admin: [
    { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users',      icon: Users,           label: 'Users' },
    { to: '/admin/jobs',       icon: Briefcase,       label: 'All Jobs' },
    { to: '/admin/analytics',  icon: BarChart3,       label: 'Analytics' },
  ],
};

const roleColors = {
  student:   { dot: 'bg-cyan-400',    label: 'Student',   badge: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
  recruiter: { dot: 'bg-indigo-400',  label: 'Recruiter', badge: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  mentor:    { dot: 'bg-violet-400',  label: 'Mentor',    badge: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
  admin:     { dot: 'bg-rose-400',    label: 'Admin',     badge: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
};

export const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const links = navConfig[role] || [];
  const rc = roleColors[role] || roleColors.student;

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed && !mobile ? 'justify-center' : ''}`}>
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap size={17} className="text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a14]" />
        </div>
        {(!collapsed || mobile) && (
          <div>
            <div className="font-bold text-white text-[15px] leading-none tracking-tight">SkillForge</div>
            <div className="text-[10px] text-white/35 mt-0.5 tracking-wide uppercase">{rc.label} Portal</div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-2" />

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-2 space-y-0.5 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed && !mobile ? 'justify-center px-0' : ''}`
            }
            title={collapsed && !mobile ? label : undefined}
          >
            <Icon size={17} className="shrink-0" />
            {(!collapsed || mobile) && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-2.5 py-3 space-y-1 border-t border-white/6 mt-2">
        {/* User card */}
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shrink-0 ring-2 ring-indigo-500/30">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-white/35 truncate">{user?.email}</div>
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${rc.badge}`}>
              {rc.label}
            </span>
          </div>
        )}
        <button onClick={handleLogout}
          className={`sidebar-link w-full text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/8 ${collapsed && !mobile ? 'justify-center px-0' : ''}`}>
          <LogOut size={16} className="shrink-0" />
          {(!collapsed || mobile) && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 230 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col h-screen sticky top-0 shrink-0 overflow-hidden"
        style={{ background: 'rgba(7,7,17,0.95)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute top-[22px] -right-3 z-20 w-6 h-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-110 transition-transform">
          <ChevronLeft size={11} className={`text-white transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
        <SidebarContent />
      </motion.aside>

      {/* Mobile fab */}
      <motion.button whileTap={{ scale: 0.92 }}
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-5 z-40 w-13 h-13 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-2xl shadow-indigo-500/40 flex items-center justify-center"
        style={{ width: 52, height: 52 }}
      >
        <Menu size={21} className="text-white" />
      </motion.button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-md" />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64"
              style={{ background: 'rgba(7,7,17,0.98)', borderRight: '1px solid rgba(255,255,255,0.10)' }}
            >
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/8 text-white/40 hover:text-white transition-all">
                <X size={15} />
              </button>
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
