import { useReactOidc } from "@axa-fr/react-oidc-context";
import { Button } from "@chakra-ui/react";
import { SimpleLayout } from "components/Layout/SimpleLayout";
import React from "react";
import { Redirect } from "react-router-dom";
export const RedirectLogin = () => <Redirect to="/login" />;
export const Login = () => {
  const { login, oidcUser } = useReactOidc();
  if (oidcUser == null)
    return (
      <SimpleLayout title="IMAGES">
        <Button colorScheme="blue" onClick={() => login()}>
          Đăng nhập
        </Button>
      </SimpleLayout>
    );
  return <Redirect to="/app" />;
};
