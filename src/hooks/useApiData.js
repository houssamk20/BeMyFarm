import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data-fetching hook with fallback to mock data.
 * @param {Function} apiFn   - async function that returns { data }
 * @param {any}      mockFn  - fallback value when API is unavailable
 * @param {Array}    deps    - re-fetch deps (default [])
 */
export function useApiData(apiFn, mockData, deps = []) {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn();
      setData(res.data);
    } catch {
      // Fall back to mock data silently in dev
      setData(mockData);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
