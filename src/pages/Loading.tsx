import { Spinner } from "@chakra-ui/core";
import { SimpleLayout } from "components/Layout/SimpleLayout";
import React from "react";

export const Loading = () => (
  <SimpleLayout title="Đợi xíu nghe">
    <Spinner />
  </SimpleLayout>
);
