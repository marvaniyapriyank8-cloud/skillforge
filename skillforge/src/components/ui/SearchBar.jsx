import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const SearchBar = ({ value, onChange, placeholder = 'Search…', icon: Icon = Search, className }) => (
  <div className={cn('relative', className)}>
    <Icon size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder.replace(/…$/, '')}
      className="block h-9 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-9 text-sm text-fg shadow-card transition-colors placeholder:text-fg-subtle hover:border-fg-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Clear search"
        className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-fg-subtle hover:bg-subtle hover:text-fg"
      >
        <X size={14} aria-hidden="true" />
      </button>
    )}
  </div>
);
