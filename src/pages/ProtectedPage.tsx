import React from "react";
import { PageHeader } from "components/Layout/PageHeader";
import { Route, Switch } from "react-router-dom";
import { ImageHome } from "components/Image/ImageAdmin";
import { Trash } from "components/Image/ImageTrash";
import { withOidcSecure } from "@axa-fr/react-oidc-context";
import { Box } from "@chakra-ui/react";
const Pages = () => {
  return (
    <>
      <PageHeader />
      <Box h={0} flex={1}>
        <Switch>
          <Route path="/app" exact component={ImageHome} />
          <Route path="/app/trash" exact component={Trash} />
        </Switch>
      </Box>
    </>
  );
};
export const ProtectedPages = withOidcSecure(Pages);
