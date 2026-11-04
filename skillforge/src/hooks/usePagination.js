import { useCallback, useMemo, useState } from 'react';

/**
 * Client-side pagination over an already-filtered list.
 *
 * Pass a `resetKey` that changes whenever the filters change (e.g. `${search}|${status}`)
 * and the list jumps back to page 1. The page is also clamped, so shrinking the
 * results never leaves you on an empty page.
 */
export function usePagination(items, pageSize = 10, resetKey = '') {
  const [state, setState] = useState({ page: 1, key: resetKey });
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const requested = state.key === resetKey ? state.page : 1;
  const page = Math.min(requested, totalPages);

  const setPage = useCallback((next) => setState({ page: next, key: resetKey }), [resetKey]);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  return { page, setPage, totalPages, total, pageSize, pageItems };
}
