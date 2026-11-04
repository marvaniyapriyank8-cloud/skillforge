import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { cn } from '../../utils/cn';

export const ThemeToggle = ({ className }) => {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cn('flex h-8 w-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-subtle hover:text-fg', className)}
    >
      {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
};
