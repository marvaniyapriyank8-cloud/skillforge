import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

/** 1 … 4 5 6 … 12 */
const pageWindow = (page, totalPages) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('gap');
    out.push(p);
  });
  return out;
};

export const Pagination = ({ page, totalPages, onPageChange, total, pageSize }) => {
  if (totalPages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const btn =
    'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors disabled:pointer-events-none disabled:opacity-40';

  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-fg-muted">
        {total != null && pageSize
          ? <>Showing <span className="font-medium text-fg">{from}–{to}</span> of <span className="font-medium text-fg">{total}</span></>
          : <>Page {page} of {totalPages}</>}
      </p>
      <div className="flex items-center gap-1">
        <button type="button" className={cn(btn, 'text-fg-muted hover:bg-subtle')} onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        {pageWindow(page, totalPages).map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className="px-1 text-fg-subtle" aria-hidden="true">…</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              aria-label={`Page ${p}`}
              className={cn(btn, p === page ? 'bg-brand text-on-brand' : 'text-fg-muted hover:bg-subtle')}
            >
              {p}
            </button>
          )
        )}
        <button type="button" className={cn(btn, 'text-fg-muted hover:bg-subtle')} onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};
