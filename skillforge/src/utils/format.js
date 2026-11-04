const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** "12 Mar 2025" – returns an em dash for missing/invalid dates. */
export const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : dateFmt.format(d);
};

/** "Aarav Mehta" -> "AM" */
export const initials = (name = '') =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || 'U';

export const firstName = (name = '') => name.trim().split(/\s+/)[0] || '';

export const plural = (n, word, pluralWord = `${word}s`) => `${n} ${n === 1 ? word : pluralWord}`;

/** Case-insensitive "does any field contain the query" helper for client-side search. */
export const matchesQuery = (query, ...fields) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((f) => String(f ?? '').toLowerCase().includes(q));
};

/** Same id whether the backend sent a populated object or a raw id. */
export const idOf = (ref) => (ref && typeof ref === 'object' ? ref._id : ref);

export const errorMessage = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || fallback;
