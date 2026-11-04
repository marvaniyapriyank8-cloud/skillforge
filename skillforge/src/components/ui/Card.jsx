import { cn } from '../../utils/cn';

export const Card = ({ children, className, ...props }) => (
  <div className={cn('rounded-xl border border-line bg-surface shadow-card', className)} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ title, description, action, className }) => (
  <div className={cn('flex items-start justify-between gap-3 border-b border-line px-5 py-4', className)}>
    <div className="min-w-0">
      <h2 className="text-sm font-semibold text-fg">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-fg-muted">{description}</p>}
    </div>
    {action}
  </div>
);

export const CardBody = ({ children, className }) => (
  <div className={cn('p-5', className)}>{children}</div>
);

export const StatCard = ({ label, value, icon: Icon, hint }) => (
  <Card className="p-5">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-fg-muted">{label}</p>
      {Icon && (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand-fg">
          <Icon size={16} aria-hidden="true" />
        </span>
      )}
    </div>
    <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-fg">{value}</p>
    {hint && <p className="mt-1 text-xs text-fg-subtle">{hint}</p>}
  </Card>
);
