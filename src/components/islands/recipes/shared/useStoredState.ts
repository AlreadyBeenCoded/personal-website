import { useEffect, useRef, useState } from 'react';

/*
 * localStorage-backed state for the recipe calculators. The stored value
 * is applied in an effect, not during render, so server HTML and the
 * first client render always match (one frame of defaults instead of a
 * hydration mismatch). Stored objects are merged over the defaults so a
 * schema addition never strands a returning visitor with a broken shape.
 */
export function useStoredState<T extends Record<string, unknown>>(
  key: string,
  defaults: T,
): [T, (patch: Partial<T>) => void] {
  const [value, setValue] = useState(defaults);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue({ ...defaults, ...JSON.parse(raw) });
    } catch {
      /* private mode or disabled storage — defaults are fine */
    }
    loaded.current = true;
  }, [key]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* best effort */
    }
  }, [key, value]);

  return [value, (patch) => setValue((v) => ({ ...v, ...patch }))];
}
