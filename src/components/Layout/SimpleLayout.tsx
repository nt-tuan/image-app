import { Flex, Heading } from "@chakra-ui/react";
import { LogoIcon } from "components/Layout/LogoIcon";
import React from "react";
interface Props {
  title: string;
  info?: React.ReactNode;
  children: React.ReactNode;
}

export const SimpleLayout = (props: Props) => {
  return (
    <Flex direction="column" alignItems="center" h="100%">
      <Flex color="blue.500" direction="row" alignItems="baseline">
        <LogoIcon color="blue.500" />
        <Heading ml={2}>{props.title}</Heading>
      </Flex>
      {props.info}
      <Flex flexGrow={1} alignItems="center" justify="center">
        {props.children}
      </Flex>
    </Flex>
  );
};
