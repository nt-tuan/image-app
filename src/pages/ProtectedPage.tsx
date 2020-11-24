import React from "react";
import { PageHeader } from "components/Layout/PageHeader";
import { Route, Switch } from "react-router-dom";
import { ImageHome } from "components/Image/ImageAdmin";
import { Trash } from "components/Image/ImageTrash";
import { withOidcSecure } from "@axa-fr/react-oidc-context";
const Pages = () => {
  return (
    <>
      <PageHeader />
      <Switch>
        <Route path="/app" component={ImageHome} />
        <Route path="/app/trash" component={Trash} />
      </Switch>
    </>
  );
};
export const ProtectedPages = withOidcSecure(Pages);
