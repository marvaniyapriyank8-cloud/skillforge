import { cn } from '../../utils/cn';

/** Bordered card that scrolls horizontally on narrow screens instead of breaking the layout. */
export const TableCard = ({ children, className }) => (
  <div className={cn('overflow-hidden rounded-xl border border-line bg-surface shadow-card', className)}>
    {/* `relative` makes this the containing block for absolutely-positioned content
        (e.g. sr-only labels), so they're clipped here instead of widening the page. */}
    <div className="relative overflow-x-auto">{children}</div>
  </div>
);

export const Table = ({ children, minWidth = 640 }) => (
  <table className="w-full border-collapse text-left text-sm" style={{ minWidth }}>
    {children}
  </table>
);

export const Th = ({ children, className }) => (
  <th
    scope="col"
    className={cn(
      'whitespace-nowrap bg-subtle px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-fg-subtle first:pl-5 last:pr-5',
      className
    )}
  >
    {children}
  </th>
);

export const Tr = ({ children, className }) => (
  <tr className={cn('border-t border-line transition-colors first:border-t-0 hover:bg-subtle/60', className)}>
    {children}
  </tr>
);

export const Td = ({ children, className }) => (
  <td className={cn('px-4 py-3 align-middle text-fg-muted first:pl-5 last:pr-5', className)}>{children}</td>
);
