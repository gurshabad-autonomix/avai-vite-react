import { env } from "./env";

// Keycloak configuration wrapper
// Note: We keep this file name for compatibility with existing imports.
const keycloakConfig = {
  url: env.KEYCLOAK_URL,
  realm: env.KEYCLOAK_REALM,
  clientId: env.KEYCLOAK_CLIENT_ID,
  redirectUri: env.REDIRECT_URI,
  silentCheckSsoRedirectUri: env.SILENT_CHECK_SSO_REDIRECT_URI,
};

export default keycloakConfig;
