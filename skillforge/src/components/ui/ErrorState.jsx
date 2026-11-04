import { CircleAlert, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({ title = "Couldn't load this page", description, onRetry }) => (
  <div
    role="alert"
    className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface px-6 py-12 text-center shadow-card"
  >
    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-danger-soft text-danger-fg">
      <CircleAlert size={20} aria-hidden="true" />
    </span>
    <h3 className="text-sm font-semibold text-fg">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-fg-muted">
      {description || 'Check your connection and try again. If the problem continues, the server may be waking up.'}
    </p>
    {onRetry && (
      <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
        <RefreshCw size={14} aria-hidden="true" /> Try again
      </Button>
    )}
  </div>
);
