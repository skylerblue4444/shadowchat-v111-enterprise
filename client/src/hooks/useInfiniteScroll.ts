/**
 * Infinite Scroll Hook — Paginated data loading on scroll
 */
import { useState, useEffect, useCallback, useRef } from "react";

interface InfiniteScrollOptions<T> {
  fetchFn: (page: number) => Promise<{ items: T[]; hasMore: boolean }>;
  threshold?: number;
}

export function useInfiniteScroll<T>(options: InfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const result = await options.fetchFn(page);
      setItems(prev => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage(p => p + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, options.fetchFn]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: options.threshold || 0.5 }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return { items, loading, hasMore, error, sentinelRef, reset };
}
