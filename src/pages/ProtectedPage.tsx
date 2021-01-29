import React from "react";
import { PageHeader } from "components/Layout2/PageHeader";
import { Route, Switch } from "react-router-dom";
import { ImageHome } from "components/ImageTemp/ImageAdmin";
import { Trash } from "components/ImageTemp/ImageTrash";
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
