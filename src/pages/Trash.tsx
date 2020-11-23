import { useReactOidc, withOidcSecure } from "@axa-fr/react-oidc-context";
import { Trash } from "components/Image/ImageTrash";
import { PageHeader } from "components/Layout/PageHeader";
import React from "react";
import { Redirect } from "react-router-dom";

const SecureTrash = () => {
  const { oidcUser } = useReactOidc();
  const roles: string[] = oidcUser.profile.roles;
  if (
    oidcUser.profile == null ||
    roles == null ||
    roles.filter((role) => role === "image.read").length === 0
  )
    return <Redirect to="/401" />;
  return (
    <>
      <PageHeader />
      <Trash />
    </>
  );
};
export const TrashPage = withOidcSecure(SecureTrash);
