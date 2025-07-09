import { useCallback, useEffect, useRef, useState } from "react";

export function useListing<Q extends object, R>({ fetcher, initialQuery = { page: 0, limit: 10 }, enableCache = false, cacheTtl = 5 * 60 * 1000 }: UsePaginationProps<Q, R>) {
  const [query, setQuery] = useState<PaginationQuery<Q>>(initialQuery as PaginationQuery<Q>);
  const [data, setData] = useState<PaginationResponse<R> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry<R>>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Improved serialization with consistent key ordering
  const serializeQuery = useCallback((q: PaginationQuery<Q>) => {
    const sortedKeys = Object.keys(q).sort();
    const sortedQuery = sortedKeys.reduce((acc, key) => {
      acc[key] = q[key as keyof PaginationQuery<Q>];
      return acc;
    }, {} as any);
    return JSON.stringify(sortedQuery);
  }, []);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      setError(null);

      const cacheKey = serializeQuery(query);
      const now = Date.now();

      // Check cache only if enabled and not forcing refresh
      if (enableCache && !forceRefresh) {
        const cacheEntry = cacheRef.current.get(cacheKey);
        if (cacheEntry && cacheEntry.expiresAt > now) {
          setData(cacheEntry.data);
          setLoading(false);
          return cacheEntry.data;
        } else if (cacheEntry) {
          // Remove expired cache entry
          cacheRef.current.delete(cacheKey);
        }
      }

      try {
        const response = await fetcher(query);

        // Check if request was aborted
        if (abortController.signal.aborted) {
          return;
        }

        // Cache the response if caching is enabled
        if (enableCache) {
          cacheRef.current.set(cacheKey, {
            data: response,
            expiresAt: now + cacheTtl,
          });
        }

        setData(response);
        return response;
      } catch (err: any) {
        if (!abortController.signal.aborted) {
          setError(err);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [query, enableCache, fetcher, cacheTtl, serializeQuery],
  );

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const updateQuery = useCallback((newQuery: Partial<PaginationQuery<Q>>) => {
    setQuery((prev) => ({ ...prev, ...newQuery }));
  }, []);

  const refetch = useCallback(() => {
    return fetchData(true); // Force refresh, bypass cache
  }, [fetchData]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const clearCacheForQuery = useCallback(
    (targetQuery?: PaginationQuery<Q>) => {
      const queryToUse = targetQuery || query;
      const cacheKey = serializeQuery(queryToUse);
      cacheRef.current.delete(cacheKey);
    },
    [query, serializeQuery],
  );

  const append = useCallback(
    (...newItems: R[]) => {
      setData((prev) => {
        if (!prev) return prev;
        const currentItems = prev.content ?? [];
        const newTotalElements = prev.totalElements + newItems.length;
        const newTotalPages = Math.ceil(newTotalElements / query.limit);

        const updatedData = {
          ...prev,
          content: [...currentItems, ...newItems],
          totalElements: newTotalElements,
          totalPages: newTotalPages,
        };

        // Update cache with new data
        if (enableCache) {
          const cacheKey = serializeQuery(query);
          const existingCache = cacheRef.current.get(cacheKey);
          if (existingCache) {
            cacheRef.current.set(cacheKey, {
              ...existingCache,
              data: updatedData,
            });
          }
        }

        return updatedData;
      });
    },
    [query.limit, enableCache, serializeQuery, query],
  );

  const remove = useCallback(
    (predicate: (item: R) => boolean) => {
      setData((prev) => {
        if (!prev) return prev;
        const currentItems = prev.content ?? [];
        const index = currentItems.findIndex(predicate);
        if (index === -1) return prev;

        const newItems = [...currentItems.slice(0, index), ...currentItems.slice(index + 1)];
        const newTotalElements = prev.totalElements - 1;
        const limit = query.limit || 10;
        const newTotalPages = Math.max(1, Math.ceil(newTotalElements / limit));

        const updatedData = {
          ...prev,
          content: newItems,
          totalElements: newTotalElements,
          totalPages: newTotalPages,
        };

        // Update cache with new data
        if (enableCache) {
          const cacheKey = serializeQuery(query);
          const existingCache = cacheRef.current.get(cacheKey);
          if (existingCache) {
            cacheRef.current.set(cacheKey, {
              ...existingCache,
              data: updatedData,
            });
          }
        }

        return updatedData;
      });
    },
    [enableCache, serializeQuery, query],
  );

  const update = useCallback(
    (predicate: (item: R) => boolean, updater: (item: R) => R) => {
      setData((prev) => {
        if (!prev) return prev;
        const currentItems = prev.content ?? [];
        const updatedItems = currentItems.map((item) => (predicate(item) ? updater(item) : item));

        const updatedData = {
          ...prev,
          content: updatedItems,
        };

        if (enableCache) {
          const cacheKey = serializeQuery(query);
          const existingCache = cacheRef.current.get(cacheKey);
          if (existingCache) {
            cacheRef.current.set(cacheKey, {
              ...existingCache,
              data: updatedData,
            });
          }
        }

        return updatedData;
      });
    },
    [enableCache, serializeQuery, query],
  );

  return {
    data,
    loading,
    error,
    query,
    setQuery: updateQuery,
    refetch,
    clearCache,
    clearCacheForQuery,
    append,
    remove,
    update,
  };
}
