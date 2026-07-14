import { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-white/70">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute left-0.3 top-1/2 -translate-y-1/2 text-white/30">
          <Icon size={16} />
        </div>
      )}
      <input
        ref={ref}
        className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500/50 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));
Input.displayName = 'Input';

export const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-white/70">{label}</label>}
    <textarea
      ref={ref}
      className={`input-field resize-none ${error ? 'border-red-500/50' : ''} ${className}`}
      rows={4}
      {...props}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-white/70">{label}</label>}
    <select
      ref={ref}
      className={`input-field ${error ? 'border-red-500/50' : ''} ${className}`}
      style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));
Select.displayName = 'Select';
