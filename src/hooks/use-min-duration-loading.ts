import { useEffect, useRef, useState } from "react";

/**
 * Keeps a loading state visible for at least `minMs` milliseconds, even if
 * the underlying `isLoading` flag flips to false sooner (e.g. fast/cached
 * API responses). Useful for skeleton loaders that shouldn't flash briefly.
 */
export function useMinDurationLoading(isLoading: boolean, minMs: number): boolean {
  const [visible, setVisible] = useState(isLoading);
  const startedAtRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoading) {
      startedAtRef.current = Date.now();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setVisible(true);
      return;
    }

    if (startedAtRef.current === null) {
      setVisible(false);
      return;
    }

    const elapsed = Date.now() - startedAtRef.current;
    const remaining = Math.max(minMs - elapsed, 0);

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      startedAtRef.current = null;
    }, remaining);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoading, minMs]);

  return visible;
}
