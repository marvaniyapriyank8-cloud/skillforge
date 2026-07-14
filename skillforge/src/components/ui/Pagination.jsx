import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="p-2 rounded-lg glass hover:bg-white/8 disabled:opacity-30 transition-all">
        <ChevronLeft size={16} className="text-white/70" />
      </button>
      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-indigo-600 text-white' : 'glass text-white/50 hover:text-white hover:bg-white/8'}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
        className="p-2 rounded-lg glass hover:bg-white/8 disabled:opacity-30 transition-all">
        <ChevronRight size={16} className="text-white/70" />
      </button>
    </div>
  );
};
