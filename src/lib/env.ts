export const env = {
  // Deprecated (Cognito) - kept for backward compatibility if referenced elsewhere
  AWS_USER_POOL_ID: import.meta.env.VITE_USER_POOL_ID,
  AWS_USER_POOL_CLIENT_ID: import.meta.env.VITE_USER_POOL_CLIENT_ID,
  AUTH_DOMAIN: import.meta.env.VITE_AUTH_DOMAIN,
  REDIRECT_SIGN_IN: import.meta.env.VITE_REDIRECT_SIGN_IN,

  // API base
  API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,

  // Keycloak configuration
  KEYCLOAK_URL: import.meta.env.VITE_KEYCLOAK_URL,
  KEYCLOAK_REALM: import.meta.env.VITE_KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI,
  SILENT_CHECK_SSO_REDIRECT_URI: import.meta.env
    .VITE_SILENT_CHECK_SSO_REDIRECT_URI,
};
