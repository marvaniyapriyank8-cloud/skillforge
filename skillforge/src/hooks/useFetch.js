import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Loads data once on mount and again whenever `reload()` is called.
 *
 * - `loading` is true only for the very first load, so a refresh after a
 *   mutation keeps the current data on screen instead of flashing skeletons.
 * - Results of an outdated/unmounted request are ignored.
 * - `fetcher` may be an inline function; the latest one is always used.
 */
export function useFetch(fetcher) {
  const fetcherRef = useRef(fetcher);
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() => fetcherRef.current())
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState((prev) => ({ data: prev.data, loading: false, error }));
      });
    return () => {
      cancelled = true;
    };
  }, [version]);

  const reload = useCallback(() => {
    setState((prev) => (prev.error ? { data: prev.data, loading: true, error: null } : prev));
    setVersion((v) => v + 1);
  }, []);

  return { ...state, reload };
}
