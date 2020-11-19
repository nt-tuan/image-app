import { useReactOidc } from "@axa-fr/react-oidc-context";
import { Box, Button } from "@chakra-ui/react";
import { SimpleLayout } from "components/Layout/SimpleLayout";
import React from "react";

export const NotAuthorized = () => {
  const { login } = useReactOidc();
  return (
    <SimpleLayout
      title="401"
      info={<Box fontSize="lg">Unauthorize access</Box>}
    >
      <Button variantColor="blue" onClick={() => login()}>
        Đăng nhập
      </Button>
    </SimpleLayout>
  );
};
