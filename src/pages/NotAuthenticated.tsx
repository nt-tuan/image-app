import React from "react";
import { SimpleLayout } from "components/layout/SimpleLayout";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const NotAuthenticated = () => {
  return (
    <SimpleLayout title="404">
      <Link to={"/login"}>
        <Button>Home</Button>
      </Link>
    </SimpleLayout>
  );
};
