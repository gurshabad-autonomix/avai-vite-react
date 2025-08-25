const currentOrigin = window.location.origin;
export const env = {
  // API base
  API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,

  // Keycloak configuration
  KEYCLOAK_URL: import.meta.env.VITE_KEYCLOAK_URL,
  KEYCLOAK_REALM: import.meta.env.VITE_KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  REDIRECT_URI: import.meta.env.VITE_KEYCLOAK_URL,
  SILENT_CHECK_SSO_REDIRECT_URI: currentOrigin + "/silent-check-sso.html",
};
