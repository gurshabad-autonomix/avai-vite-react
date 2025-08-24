import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";

import { ReactKeycloakProvider } from "@react-keycloak/web";
import Keycloak from "keycloak-js";
import keycloakConfig from "@/lib/aws.ts";

const keycloak = new Keycloak({
  url: keycloakConfig.url,
  realm: keycloakConfig.realm,
  clientId: keycloakConfig.clientId,
});

createRoot(document.getElementById("root")!).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: "check-sso",
      pkceMethod: "S256",
      silentCheckSsoRedirectUri:
        keycloakConfig.silentCheckSsoRedirectUri ||
        `${window.location.origin}/silent-check-sso.html`,
      checkLoginIframe: false,
    }}
    LoadingComponent={null}
  >
    <App />
  </ReactKeycloakProvider>
);
