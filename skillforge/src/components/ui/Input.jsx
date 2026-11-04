import { forwardRef, useId, useState } from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

const control =
  'block w-full rounded-lg border bg-surface text-sm text-fg shadow-card transition-colors ' +
  'placeholder:text-fg-subtle focus:outline-none focus:ring-2 disabled:bg-subtle disabled:text-fg-subtle';

const controlState = (error) =>
  error
    ? 'border-danger focus:border-danger focus:ring-danger/25'
    : 'border-line-strong hover:border-fg-subtle focus:border-brand focus:ring-brand/25';

/** Label + control + hint/error, wired together for assistive tech. */
const Field = ({ id, label, hint, error, children, optional }) => (
  <div>
    {label && (
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">
        {label}
        {optional && <span className="ml-1 font-normal text-fg-subtle">(optional)</span>}
      </label>
    )}
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger-fg">{error}</p>
    ) : hint ? (
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-fg-subtle">{hint}</p>
    ) : null}
  </div>
);

const describedBy = (id, error, hint) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

export const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, optional, className, id, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <Field id={inputId} label={label} hint={hint} error={error} optional={optional}>
      <div className="relative">
        {Icon && (
          <Icon size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn(control, controlState(error), 'h-9', Icon ? 'pl-9 pr-3' : 'px-3', className)}
          {...props}
        />
      </div>
    </Field>
  );
});

export const PasswordInput = forwardRef(function PasswordInput(
  { label, error, hint, icon: Icon, className, id, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  const [visible, setVisible] = useState(false);
  return (
    <Field id={inputId} label={label} hint={hint} error={error}>
      <div className="relative">
        {Icon && (
          <Icon size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
        )}
        <input
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn(control, controlState(error), 'h-9 pr-10', Icon ? 'pl-9' : 'pl-3', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-fg-subtle hover:bg-subtle hover:text-fg"
        >
          {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        </button>
      </div>
    </Field>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, error, hint, optional, className, id, rows = 4, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <Field id={inputId} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, error, hint)}
        className={cn(control, controlState(error), 'resize-y px-3 py-2 leading-relaxed', className)}
        {...props}
      />
    </Field>
  );
});

export const Select = forwardRef(function Select(
  { label, error, hint, optional, className, id, children, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <Field id={inputId} label={label} hint={hint} error={error} optional={optional}>
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, error, hint)}
          className={cn(control, controlState(error), 'h-9 appearance-none pl-3 pr-9', className)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
      </div>
    </Field>
  );
});
