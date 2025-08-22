import { useAuth } from "react-oidc-context";
import { useCallback, useMemo } from "react";
import aws from "@/lib/aws";
import { env } from "@/lib/env";

/**
 * Custom hook for Cognito authentication
 * Provides easy access to auth state, tokens, and auth actions
 */
export const useCognitoAuth = () => {
  const auth = useAuth();

  // Get access token for API calls
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!auth.user) {
      return null;
    }

    // Check if token is expired or about to expire (within 5 minutes)
    const expiresAt = auth.user.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const bufferTime = 5 * 60; // 5 minutes buffer

    if (expiresAt && expiresAt - now < bufferTime) {
      try {
        // Refresh the token silently
        await auth.signinSilent();
      } catch (error) {
        console.error("Failed to refresh token:", error);
        return null;
      }
    }

    return auth.user?.access_token || null;
  }, [auth]);

  // Sign out function with proper Cognito logout
  const signOut = useCallback(async () => {
    try {
      // Remove the user from local session
      await auth.removeUser();

      // Then redirect to Cognito's logout endpoint
      const clientId = aws.Auth.Cognito.userPoolClientId;
      const logoutUri = aws.Auth.oauth.redirectSignOut;
      const cognitoDomain = `https://${aws.Auth.oauth.domain}`;

      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
        logoutUri
      )}`;
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }, [auth]);

  // Sign in function
  const signIn = useCallback(() => {
    auth.signinRedirect();
  }, [auth]);

  // User profile information
  const userProfile = useMemo(() => {
    if (!auth.user?.profile) return null;

    return {
      id: auth.user.profile.sub,
      email: auth.user.profile.email,
      name: auth.user.profile.name,
      phoneNumber: auth.user.profile.phone_number,
      emailVerified: auth.user.profile.email_verified,
      phoneVerified: auth.user.profile.phone_number_verified,
    };
  }, [auth.user?.profile]);

  // Auth state
  const authState = useMemo(
    () => ({
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      error: auth.error,
      activeNavigator: auth.activeNavigator,
    }),
    [auth.isAuthenticated, auth.isLoading, auth.error, auth.activeNavigator]
  );

  return {
    ...authState,
    user: userProfile,
    getAccessToken,
    signIn,
    signOut,
    // Raw auth object for advanced use cases
    rawAuth: auth,
  };
};

export const useAuthenticatedFetch = () => {
  const { getAccessToken } = useCognitoAuth();

  const apiBaseUrl = env.API_ENDPOINT;

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const token = await getAccessToken();

      if (!token) {
        throw new Error("No access token available");
      }

      const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      return fetch(`${apiBaseUrl}${url}`, {
        ...options,
        headers,
      });
    },
    [getAccessToken]
  );

  return { authenticatedFetch };
};
