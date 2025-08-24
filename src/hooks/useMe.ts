import { useEffect, useState, useCallback } from "react";
import { useAuthenticatedFetch } from "./useAuth";
import { useAtom } from "jotai";
import { meAtom } from "@/state/auth";
import type { MeResponse } from "@/types/auth";

// Hook that fetches /me and persists to jotai atom

export function useMe() {
  const { authenticatedFetch } = useAuthenticatedFetch();
  const [data, setData] = useAtom(meAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authenticatedFetch("/users/me");
      if (!res.ok) throw new Error(`${res.status}`);
      const json = (await res.json()) as MeResponse;
      setData(json);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
