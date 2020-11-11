import React from "react";
import "./App.css";
import {
  ThemeProvider,
  CSSReset,
  theme,
  Spinner,
  Flex,
  Box,
} from "@chakra-ui/core";
import { AuthenticationProvider } from "@axa-fr/react-oidc-context";
import { oidcConfiguration } from "resources/oidcConfiguration";
import { NotAuthenticated as NotFound } from "pages/NotAuthenticated";
import { NotAuthorized } from "pages/NotAuthorized";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import { Home } from "pages/Home";
import { PageHeader } from "components/Layout/PageHeader";
import { Login, RedirectLogin } from "pages/Login";

const customIcons = {
  logo: {
    path: (
      <path
        fill="currentColor"
        d="M565 515 L550 550 L565 585 L600 600 L670 520 L700 450 L570 370 L500 350 L350 500 L300 650 L0 650 L147 297 L500 150 L712 238 L800 450 L764 594 L600 650 L530 620 L500 550 L530 480 L600 450 Z"
      />
    ),
    // If the icon's viewBox is `0 0 24 24`, you can ignore `viewBox`
    viewBox: "0 -150 800 650",
  },
};

// Step 2: Add the custom icon to the theme
const customTheme = {
  ...theme,
  icons: {
    ...theme.icons,
    ...customIcons,
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <AuthenticationProvider
        configuration={oidcConfiguration}
        notAuthenticated={NotAuthorized}
        notAuthorized={NotAuthorized}
        authenticating={Spinner}
        callbackComponentOverride={Spinner}
        sessionLostComponent={Spinner}
      >
        <BrowserRouter>
          <Flex direction="column" h="100vh">
            <Flex color="gray.50" h={8} bg="blue.500">
              <PageHeader />
            </Flex>
            <Box flexGrow={1}>
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
                <Route path="/404" exact component={NotFound} />
                <Route path="/">
                  <Redirect to="/login" />
                </Route>
              </Switch>
            </Box>
          </Flex>
        </BrowserRouter>
      </AuthenticationProvider>
    </ThemeProvider>
  );
}

export default App;
