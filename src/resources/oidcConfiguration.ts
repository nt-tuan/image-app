import { UserManagerSettings } from "oidc-client";

export const oidcConfiguration: UserManagerSettings = {
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: `${process.env.REACT_APP_URL}/callback`,
  response_type: "code",
  post_logout_redirect_uri: `${process.env.REACT_APP_URL}/logout/callback`,
  scope: "openid profile offline user.read image.read image.write",
  authority: process.env.REACT_APP_AUTH_URL,
  silent_redirect_uri: `${process.env.REACT_APP_URL}/authentication/silent_callback`,
  automaticSilentRenew: true,
  loadUserInfo: true,
};

export const constants = {
  AUTH_TOKEN_KEY: "auth_token",
};
