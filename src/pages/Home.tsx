import { useReactOidc, withOidcSecure } from "@axa-fr/react-oidc-context";
import { ImageHome } from "components/ImageHome/ImageAdmin";
import React from "react";
import { Redirect } from "react-router-dom";

const SecureHome = () => {
  const { oidcUser } = useReactOidc();
  const roles: string[] = oidcUser.profile.roles;
  console.log(roles);
  if (
    oidcUser.profile == null ||
    roles == null ||
    roles.filter((role) => role === "image.read").length === 0
  )
    return <Redirect to="/401" />;
  return <ImageHome />;
};
export const Home = withOidcSecure(SecureHome);
