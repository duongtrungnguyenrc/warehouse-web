"use client";

import { useCallback, useState } from "react";

type AsyncState<T> = {
  loading: boolean;
  error: Error | null;
  result: T | null;
};

type UseAsyncReturn<T, A extends unknown[]> = AsyncState<T> & {
  call: (...args: A) => Promise<T | undefined>;
  reset: () => void;
};

export function useQuery<T = any, A extends unknown[] = any[]>(asyncFn: (...args: A) => Promise<T>, defaultResult: T | null = null): UseAsyncReturn<T, A> {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<T | null>(defaultResult);
  const [error, setError] = useState<Error | null>(null);

  const call = useCallback(
    async (...args: A): Promise<T | undefined> => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const data = await asyncFn(...args);
        setResult(data);
        return data;
      } catch (e: any) {
        setError(e);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn],
  );

  const reset = useCallback(() => {
    setLoading(false);
    setResult(null);
    setError(null);
  }, []);

  return { loading, result, error, call, reset };
}
