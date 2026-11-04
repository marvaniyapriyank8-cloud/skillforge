import { initials } from '../../utils/format';
import { cn } from '../../utils/cn';

const sizes = {
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-20 w-20 text-2xl',
};

export const Avatar = ({ name, src, size = 'md', className }) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-soft font-semibold text-brand-fg',
      sizes[size],
      className
    )}
  >
    {src ? (
      <img src={src} alt={name ? `${name} profile photo` : 'Profile photo'} className="h-full w-full object-cover" />
    ) : (
      <span aria-hidden="true">{initials(name)}</span>
    )}
  </span>
);
