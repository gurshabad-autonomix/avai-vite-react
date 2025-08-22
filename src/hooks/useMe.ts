import { useEffect, useState, useCallback } from "react";
import { useAuthenticatedFetch } from "./useCognitoAuth";

// Hook that fetches /me. For now uses a mock, but respects authenticated fetch interface for easy swap later.
export interface MeResponse {
  email: string;
  fullName: string;
  role: string;
  customerId?: string;
  onboarded: boolean;
}

export function useMe() {
  const { authenticatedFetch } = useAuthenticatedFetch();
  const [data, setData] = useState<MeResponse | null>(null);
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
