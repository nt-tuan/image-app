import { Spinner } from "@chakra-ui/react";
import { SimpleLayout } from "components/Layout2/SimpleLayout";
import React from "react";

export const Loading = () => (
  <SimpleLayout>
    <Spinner />
  </SimpleLayout>
);
