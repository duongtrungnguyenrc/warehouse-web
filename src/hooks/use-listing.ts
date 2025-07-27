"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useListing<Q extends object, R>({
  fetcher,
  initialQuery = {
    page: 0,
    size: 20,
  },
  enableCache = false,
  cacheTtl = 5 * 60 * 1000,
}: UsePaginationProps<Q, R>) {
  const [query, setQuery] = useState<PaginationQuery<Q>>(initialQuery as PaginationQuery<Q>);
  const [data, setData] = useState<PaginationResponse<R> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry<R>>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      setError(null);

      const cacheKey = serializeQuery(query);
      const now = Date.now();

      if (enableCache && !forceRefresh) {
        const cacheEntry = cacheRef.current.get(cacheKey);
        if (cacheEntry && cacheEntry.expiresAt > now) {
          setData(cacheEntry.data);
          setLoading(false);
          return cacheEntry.data;
        } else if (cacheEntry) {
          cacheRef.current.delete(cacheKey);
        }
      }

      try {
        const response = await fetcher(query);
        if (abortController.signal.aborted) return;

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

  const refetch = useCallback(() => fetchData(true), [fetchData]);

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

        const limit = query.size || 20;
        const currentItems = prev.content ?? [];
        const merged = [...newItems, ...currentItems];

        const pageItems = merged.slice(0, limit);
        let overflowItems = merged.slice(limit);

        const newTotalElements = prev.totalElements + newItems.length;
        const newTotalPages = Math.ceil(newTotalElements / limit);

        const updatedData = {
          ...prev,
          content: pageItems,
          totalElements: newTotalElements,
          totalPages: newTotalPages,
        };

        if (enableCache) {
          const now = Date.now();
          const cacheKey = serializeQuery(query);
          cacheRef.current.set(cacheKey, {
            data: updatedData,
            expiresAt: now + cacheTtl,
          });

          // Đẩy phần dư sang các page tiếp theo
          let page = (query.page || 0) + 1;
          while (overflowItems.length > 0) {
            const slice = overflowItems.slice(0, limit);
            overflowItems = overflowItems.slice(limit);

            const nextQuery = { ...query, page };
            const nextKey = serializeQuery(nextQuery);
            const existing = cacheRef.current.get(nextKey)?.data?.content ?? [];

            const mergedNextPage = [...slice, ...existing].slice(0, limit);
            const total = mergedNextPage.length;
            const newPageData: PaginationResponse<R> = {
              page,
              size: limit,
              content: mergedNextPage,
              totalElements: total,
              totalPages: Math.ceil(total / limit),
            };

            cacheRef.current.set(nextKey, {
              data: newPageData,
              expiresAt: now + cacheTtl,
            });

            page++;
          }
        }

        return updatedData;
      });
    },
    [enableCache, serializeQuery, query, cacheTtl],
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
        const limit = query.size || 10;
        const newTotalPages = Math.max(1, Math.ceil(newTotalElements / limit));

        const updatedData = {
          ...prev,
          content: newItems,
          totalElements: newTotalElements,
          totalPages: newTotalPages,
        };

        if (enableCache) {
          const cacheKey = serializeQuery(query);
          cacheRef.current.set(cacheKey, {
            data: updatedData,
            expiresAt: Date.now() + cacheTtl,
          });
        }

        return updatedData;
      });
    },
    [enableCache, serializeQuery, query, cacheTtl],
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
          cacheRef.current.set(cacheKey, {
            data: updatedData,
            expiresAt: Date.now() + cacheTtl,
          });
        }

        return updatedData;
      });
    },
    [enableCache, serializeQuery, query, cacheTtl],
  );

  const hasNextPage = useCallback(() => {
    if (!data) return false;
    return data.page + 1 < data.totalPages;
  }, [data]);

  const fetchNext = useCallback(async () => {
    if (!hasNextPage()) return;

    const nextPage = (query.page || 0) + 1;
    const nextQuery = { ...query, page: nextPage };

    const response = await fetcher(nextQuery);

    setData((prev) => {
      if (!prev) return response;

      const mergedContent = [...prev.content, ...response.content];
      const newData = {
        ...response,
        content: mergedContent,
      };

      if (enableCache) {
        const now = Date.now();
        const cacheKey = serializeQuery(nextQuery);
        cacheRef.current.set(cacheKey, {
          data: response,
          expiresAt: now + cacheTtl,
        });

        const currentKey = serializeQuery(query);
        cacheRef.current.set(currentKey, {
          data: newData,
          expiresAt: now + cacheTtl,
        });
      }

      return newData;
    });

    setQuery(nextQuery);

    return response;
  }, [query, fetcher, data, enableCache, cacheTtl, serializeQuery, hasNextPage]);

  return {
    data,
    loading,
    error,
    query,
    setQuery: updateQuery,
    refetch,
    clearCache,
    clearCacheForQuery,
    fetchNext,
    hasNextPage,
    append,
    remove,
    update,
  };
}
