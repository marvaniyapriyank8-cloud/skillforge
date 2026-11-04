import { cn } from '../../utils/cn';

const variants = {
  neutral: 'bg-subtle text-fg-muted',
  brand: 'bg-brand-soft text-brand-fg',
  success: 'bg-success-soft text-success-fg',
  warning: 'bg-warning-soft text-warning-fg',
  danger: 'bg-danger-soft text-danger-fg',
  info: 'bg-info-soft text-info-fg',
};

export const Badge = ({ children, variant = 'neutral', className }) => (
  <span
    className={cn(
      'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium',
      variants[variant],
      className
    )}
  >
    {children}
  </span>
);

const STATUS_VARIANT = {
  applied: 'info',
  shortlisted: 'warning',
  selected: 'success',
  rejected: 'danger',
  active: 'success',
  blocked: 'danger',
  student: 'info',
  recruiter: 'brand',
  mentor: 'success',
  admin: 'danger',
  general: 'neutral',
  resume: 'info',
  project: 'brand',
};

/** Color-coded badge for application status, user role/state and feedback type. */
export const StatusBadge = ({ status, className }) => {
  if (!status) return null;
  const key = String(status).toLowerCase();
  return (
    <Badge variant={STATUS_VARIANT[key] || 'neutral'} className={cn('capitalize', className)}>
      {status}
    </Badge>
  );
};
