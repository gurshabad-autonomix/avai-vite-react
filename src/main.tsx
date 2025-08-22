import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";

import aws from "@/lib/aws.ts";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

const cognitoAuthConfig = {
  authority: `https://cognito-idp.us-east-1.amazonaws.com/${aws.Auth.Cognito.userPoolId}`,
  client_id: aws.Auth.Cognito.userPoolClientId,
  redirect_uri: aws.Auth.oauth.redirectSignIn,
  response_type: aws.Auth.oauth.responseType,
  scope: aws.Auth.oauth.scope.join(" "),
  userStore: new WebStorageStateStore({ store: window.localStorage }),

  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>
);
