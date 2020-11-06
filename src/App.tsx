import React from "react";
import "./App.css";
import { ThemeProvider, CSSReset, theme, Spinner } from "@chakra-ui/core";
import { ImageHome } from "components/ImageHome";
import { AuthenticationProvider } from "@axa-fr/react-oidc-context";
import { oidcConfiguration } from "resources/oidcConfiguration";
import { NotAuthenticated } from "pages/NotAuthenticated";
import { NotAuthorized } from "pages/NotAuthorized";
import { withOidcSecure } from "@axa-fr/react-oidc-context/dist/reactServices/OidcSecure";
const SecureImageHome = withOidcSecure(ImageHome);
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <AuthenticationProvider
        configuration={oidcConfiguration}
        notAuthenticated={NotAuthenticated}
        notAuthorized={NotAuthorized}
        authenticating={Spinner}
        callbackComponentOverride={Spinner}
        sessionLostComponent={Spinner}
      >
        <SecureImageHome />
      </AuthenticationProvider>
    </ThemeProvider>
  );
}

export default App;
