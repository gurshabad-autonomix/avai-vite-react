import { env } from "./env";

const aws = {
  Auth: {
    Cognito: {
      userPoolId: env.AWS_USER_POOL_ID,
      userPoolClientId: env.AWS_USER_POOL_CLIENT_ID,
      signUpVerificationMethod: "code" as const,
    },
    oauth: {
      domain: env.AUTH_DOMAIN,
      scope: ["email", "openid", "phone", "profile"],
      redirectSignIn: env.REDIRECT_SIGN_IN,
      redirectSignOut: env.REDIRECT_SIGN_IN,
      responseType: "code",
    },
  },
};

export default aws;
