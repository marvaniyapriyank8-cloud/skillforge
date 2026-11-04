import { cn } from '../../utils/cn';

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors ' +
  'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50';

const variants = {
  primary: 'bg-brand text-on-brand shadow-card hover:bg-brand-hover',
  secondary: 'border border-line-strong bg-surface text-fg shadow-card hover:bg-subtle',
  ghost: 'text-fg-muted hover:bg-subtle hover:text-fg',
  danger: 'bg-danger text-white shadow-card hover:bg-danger-hover',
  'danger-ghost': 'text-danger-fg hover:bg-danger-soft',
  success: 'bg-success-soft text-success-fg hover:brightness-95 dark:hover:brightness-125',
};

const sizes = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-5 text-sm',
};

/** Class string for anything that should look like a button (e.g. a router <Link>). */
export const buttonStyles = ({ variant = 'primary', size = 'md', className } = {}) =>
  cn(base, variants[variant], sizes[size], className);
