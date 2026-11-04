import { Loader2 } from 'lucide-react';
import { buttonStyles } from './buttonStyles';
import { cn } from '../../utils/cn';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={buttonStyles({ variant, size, className })}
    {...props}
  >
    {loading && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
    {children}
  </button>
);

/** Square icon-only button. `label` is required for screen readers. */
export const IconButton = ({ label, children, variant = 'ghost', className, type = 'button', ...props }) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    className={cn(
      'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors disabled:opacity-50',
      variant === 'danger'
        ? 'text-fg-subtle hover:bg-danger-soft hover:text-danger-fg'
        : 'text-fg-subtle hover:bg-subtle hover:text-fg',
      className
    )}
    {...props}
  >
    {children}
  </button>
);
