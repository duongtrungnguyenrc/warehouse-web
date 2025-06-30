import { useCallback, useEffect, useRef, useState } from "react";

export function useListing<Q extends object, R>({ fetcher, initialQuery = { page: 0, limit: 10 }, enableCache = true, cacheTtl = 5 * 60 * 1000 }: UsePaginationProps<Q, R>) {
  const [query, setQuery] = useState<PaginationQuery<Q>>(initialQuery);
  const [data, setData] = useState<PaginationResponse<R> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const cacheRef = useRef<Map<string, CacheEntry<R>>>(new Map());

  const serializeQuery = useCallback((q: PaginationQuery<Q>) => JSON.stringify(q), []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const cacheKey = serializeQuery(query);
    const now = Date.now();

    if (enableCache) {
      const cacheEntry = cacheRef.current.get(cacheKey);
      if (cacheEntry && cacheEntry.expiresAt > now) {
        setData(cacheEntry.data);
        setLoading(false);
        return;
      } else {
        cacheRef.current.delete(cacheKey);
      }
    }

    try {
      const response = await fetcher(query);
      if (enableCache) {
        cacheRef.current.set(cacheKey, {
          data: response,
          expiresAt: Date.now() + cacheTtl,
        });
      }
      setData(response);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [serializeQuery, query, enableCache, fetcher, cacheTtl]);

  useEffect(() => {
    fetchData().then((res) => res);
  }, [fetchData]);

  const updateQuery = (newQuery: Partial<PaginationQuery<Q>>) => {
    setQuery((prev) => ({ ...prev, ...newQuery }));
  };

  const clearCache = () => {
    cacheRef.current.clear();
  };

  const append = (...newItems: R[]) => {
    setData((prev) => {
      if (!prev) return prev;

      const currentItems = prev.content ?? [];
      const newTotalElements = prev.totalElements + newItems.length;
      const newTotalPages = Math.ceil(newTotalElements / query.limit);

      return {
        ...prev,
        content: [...currentItems, ...newItems],
        totalElements: newTotalElements,
        totalPages: newTotalPages,
      };
    });
  };

  const remove = (predicate: (item: R) => boolean) => {
    setData((prev) => {
      if (!prev) return prev;

      const currentItems = prev.content ?? [];
      const index = currentItems.findIndex(predicate);
      if (index === -1) return prev;

      const newItems = [...currentItems.slice(0, index), ...currentItems.slice(index + 1)];
      const newTotalElements = prev.totalElements - 1;
      const limit = query.limit || 10;
      const newTotalPages = Math.max(1, Math.ceil(newTotalElements / limit));

      return {
        ...prev,
        content: newItems,
        totalElements: newTotalElements,
        totalPages: newTotalPages,
      };
    });
  };

  const update = (predicate: (item: R) => boolean, updater: (item: R) => R) => {
    setData((prev) => {
      if (!prev) return prev;

      const currentItems = prev.content ?? [];
      const updatedItems = currentItems.map((item) => (predicate(item) ? updater(item) : item));

      return {
        ...prev,
        content: updatedItems,
      };
    });
  };

  return {
    data,
    loading,
    error,
    query,
    setQuery: updateQuery,
    refetch: fetchData,
    clearCache,
    append,
    remove,
    update,
  };
}
