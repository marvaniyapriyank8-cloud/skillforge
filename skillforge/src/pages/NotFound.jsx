import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/ui/Button';
import { buttonStyles } from '../components/ui/buttonStyles';

export const NotFound = () => {
  useDocumentTitle('Page not found');
  const navigate = useNavigate();
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-brand-fg">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg">Page not found</h1>
        <p className="mt-3 text-fg-muted">The page you're looking for doesn't exist or may have been moved.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/" className={buttonStyles({ size: 'lg' })}>
            <Home size={16} aria-hidden="true" /> Back to home
          </Link>
          <Button variant="secondary" size="lg" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} aria-hidden="true" /> Go back
          </Button>
        </div>
      </div>
    </main>
  );
};
