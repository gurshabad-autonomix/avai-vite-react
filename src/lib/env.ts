export const env = {
  AWS_USER_POOL_ID: import.meta.env.VITE_USER_POOL_ID,
  AWS_USER_POOL_CLIENT_ID: import.meta.env.VITE_USER_POOL_CLIENT_ID,
  AUTH_DOMAIN: import.meta.env.VITE_AUTH_DOMAIN,
  REDIRECT_SIGN_IN: import.meta.env.VITE_REDIRECT_SIGN_IN,
  API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
};
