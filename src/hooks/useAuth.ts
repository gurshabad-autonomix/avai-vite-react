import { useCallback, useMemo } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { env } from "@/lib/env";

/**
 * Keycloak-based auth hook (keeps the same API as previous Cognito hook)
 */
export const useAuth = () => {
  const { keycloak, initialized } = useKeycloak();

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!keycloak.authenticated) {
      return null;
    }
    try {
      await keycloak.updateToken(60);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
    return keycloak.token ?? null;
  }, [keycloak]);

  const signOut = useCallback(async () => {
    try {
      await keycloak.logout({ redirectUri: `${window.location.origin}/` });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }, [keycloak]);

  const signIn = useCallback(() => {
    keycloak.login({ redirectUri: `${window.location.origin}/welcome` });
  }, [keycloak]);

  const signUp = useCallback(() => {
    keycloak.register({
      redirectUri: `${window.location.origin}/welcome`,
    });
  }, [keycloak]);

  const userProfile = useMemo(() => {
    const claims = keycloak.tokenParsed as Record<string, unknown> | undefined;
    if (!claims) return null;
    return {
      id: (claims["sub"] as string) || "",
      email: (claims["email"] as string) || "",
      name: (claims["name"] as string) || "",
      phoneNumber: (claims["phone_number"] as string) || undefined,
      emailVerified: (claims["email_verified"] as boolean) || undefined,
      phoneVerified: (claims["phone_number_verified"] as boolean) || undefined,
    };
  }, [keycloak.tokenParsed]);

  const authState = useMemo(
    () => ({
      isAuthenticated: !!keycloak.authenticated,
      isLoading: !initialized,
      error: null as unknown as Error | null,
      activeNavigator: undefined as unknown as string | undefined,
    }),
    [keycloak.authenticated, initialized]
  );

  return {
    ...authState,
    user: userProfile,
    getAccessToken,
    signIn,
    signUp,
    signOut,
    rawAuth: keycloak,
  };
};

export const useAuthenticatedFetch = () => {
  const { getAccessToken } = useAuth();
  const apiBaseUrl = env.API_ENDPOINT;

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("No access token available");
      }
      const isFormData =
        typeof FormData !== "undefined" && options.body instanceof FormData;
      const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
        Authorization: `Bearer ${token}`,
      };
      if (!isFormData && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
      return fetch(`${apiBaseUrl}${url}`, {
        ...options,
        headers,
      });
    },
    [getAccessToken, apiBaseUrl]
  );

  return { authenticatedFetch };
};
