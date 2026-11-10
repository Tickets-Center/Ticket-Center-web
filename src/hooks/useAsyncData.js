import { useEffect, useState } from "react";

/**
 * Minimal async data loader shared by feature hooks.
 * `deps` controls when the loader re-runs (same contract as useEffect).
 */
export function useAsyncData(loader, deps = [], fallbackError = "Failed to load data.") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const result = await loader();
        if (!cancelled) {
          setData(result);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || fallbackError);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, setData };
}
