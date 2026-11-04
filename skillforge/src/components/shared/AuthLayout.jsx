import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from '../ui/ThemeToggle';

/**
 * Two-column auth screen: a brand panel (large screens) and the form.
 * `points` are short statements describing what the product actually does.
 */
export const AuthLayout = ({ panelTitle, panelText, points, children }) => (
  <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
    <aside className="hidden flex-col justify-between bg-brand-panel p-10 text-white lg:flex xl:p-14">
      <Link to="/" aria-label="SkillForge home" className="w-fit">
        <Logo inverted />
      </Link>

      <div className="max-w-md">
        <h2 className="text-3xl font-semibold leading-tight tracking-tight">{panelTitle}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-white/70">{panelText}</p>
        <ul className="mt-8 space-y-4">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-white/85">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Check size={12} aria-hidden="true" />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-white/50">© {new Date().getFullYear()} SkillForge</p>
    </aside>

    <main className="flex min-h-screen flex-col px-4 py-6 sm:px-8">
      <div className="flex items-center justify-between">
        <Link to="/" aria-label="SkillForge home" className="lg:invisible">
          <Logo size={26} />
        </Link>
        <ThemeToggle />
      </div>
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-8">{children}</div>
    </main>
  </div>
);
