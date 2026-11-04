import { cn } from '../../utils/cn';

export const EmptyState = ({ icon: Icon, title, description, action, bordered = true, className }) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center px-6 py-12 text-center',
      bordered && 'rounded-xl border border-dashed border-line-strong bg-surface',
      className
    )}
  >
    {Icon && (
      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-subtle text-fg-subtle">
        <Icon size={20} aria-hidden="true" />
      </span>
    )}
    <h3 className="text-sm font-semibold text-fg">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-fg-muted">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
