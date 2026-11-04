import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/shared/Sidebar';
import { MobileNav } from '../components/shared/MobileNav';
import { PageFallback } from '../components/shared/PageFallback';
import { useAuthStore } from '../store/authStore';

export const DashboardLayout = () => {
  const role = useAuthStore((s) => s.user?.role);
  return (
    <div className="min-h-screen bg-canvas lg:flex">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-brand px-3 py-2 text-sm font-medium text-on-brand focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>
      <Sidebar role={role} />
      <div className="min-w-0 flex-1">
        <MobileNav role={role} />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-6 focus:outline-none sm:px-6 lg:px-8 lg:py-8">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};
