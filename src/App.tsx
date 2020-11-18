import React from "react";
import "./App.css";
import { ChakraProvider, CSSReset, Flex, Box } from "@chakra-ui/react";
import { AuthenticationProvider } from "@axa-fr/react-oidc-context";
import { oidcConfiguration } from "resources/oidcConfiguration";
import { NotAuthenticated as NotFound } from "pages/NotAuthenticated";
import { NotAuthorized } from "pages/NotAuthorized";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import { Home } from "pages/Home";
import { PageHeader } from "components/Layout/PageHeader";
import { Login, RedirectLogin } from "pages/Login";
import { Loading } from "pages/Loading";
import { TrashPage } from "pages/Trash";

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <AuthenticationProvider
        configuration={oidcConfiguration}
        notAuthenticated={NotAuthorized}
        notAuthorized={NotAuthorized}
        authenticating={Loading}
        callbackComponentOverride={Loading}
        sessionLostComponent={Loading}
      >
        <BrowserRouter>
          <Flex direction="column" h="100vh">
            <PageHeader />

            <Box flex={1} bgColor="gray.100" color="gray.600" overflow="hidden">
              <Switch>
                <Route path="/401" exact={true} component={NotAuthorized} />
                <Route path="/callback" exact>
                  <Redirect to="/app" />
                </Route>
                <Route path="/login" exact component={Login} />
                <Route
                  path="/logout/callback"
                  exact
                  component={RedirectLogin}
                />
                <Route path="/app" exact component={Home} />
                <Route path="/app/trash" exact component={TrashPage} />
                <Route path="/404" exact component={NotFound} />
                <Route path="/">
                  <Redirect to="/login" />
                </Route>
              </Switch>
            </Box>
          </Flex>
        </BrowserRouter>
      </AuthenticationProvider>
    </ChakraProvider>
  );
}

export default App;
