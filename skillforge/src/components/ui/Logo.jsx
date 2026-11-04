import { cn } from '../../utils/cn';

export const LogoMark = ({ size = 28, inverted = false, className }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className={className}>
    <rect width="32" height="32" rx="7" fill={inverted ? '#fff' : 'var(--brand)'} />
    <path fill={inverted ? 'var(--brand-panel)' : '#fff'} d="M9 8h14v4H13v2h10v10H9v-4h10v-2H9z" />
  </svg>
);

/** `inverted` is for use on the dark brand panel. */
export const Logo = ({ size = 28, inverted = false, className }) => (
  <span className={cn('inline-flex items-center gap-2.5', className)}>
    <LogoMark size={size} inverted={inverted} />
    <span className={cn('text-base font-semibold tracking-tight', inverted ? 'text-white' : 'text-fg')}>SkillForge</span>
  </span>
);
