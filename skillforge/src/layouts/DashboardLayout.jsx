import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/shared/Sidebar';
import { useAuthStore } from '../store/authStore';

export const DashboardLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  return (
    <div className="flex min-h-screen mesh-bg">
      <Sidebar role={user?.role} />
      <main className="flex-1 overflow-auto min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="max-w-7xl mx-auto p-5 lg:p-7"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
