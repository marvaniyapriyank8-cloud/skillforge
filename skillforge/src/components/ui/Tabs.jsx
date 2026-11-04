import { cn } from '../../utils/cn';

/**
 * Underline tabs. Pass `withPanels` when each tab controls a `role="tabpanel"`
 * element with id `panel-<tab.id>`; omit it when used as a plain filter.
 */
export const Tabs = ({ tabs, value, onChange, label, withPanels = false, className }) => (
  <div role="tablist" aria-label={label} className={cn('flex gap-1 overflow-x-auto border-b border-line', className)}>
    {tabs.map((tab) => {
      const active = tab.id === value;
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={active}
          aria-controls={withPanels ? `panel-${tab.id}` : undefined}
          onClick={() => onChange(tab.id)}
          className={cn(
            '-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
            active ? 'border-brand text-fg' : 'border-transparent text-fg-muted hover:text-fg'
          )}
        >
          {tab.icon && <tab.icon size={16} aria-hidden="true" />}
          {tab.label}
          {tab.count != null && (
            <span className={cn('rounded-full px-1.5 text-xs tabular-nums', active ? 'bg-brand-soft text-brand-fg' : 'bg-subtle text-fg-subtle')}>
              {tab.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);
