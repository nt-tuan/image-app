import React from "react";
import { Link } from "react-router-dom";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import Avatar from "react-avatar";
import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/core";

const UserMenu = () => {
  const { oidcUser, logout } = useReactOidc();
  if (oidcUser == null) return <Button variant="ghost">Đăng nhập</Button>;
  return (
    <Menu>
      <MenuButton as={Box}>
        <Flex direction="row" justify="end" alignItems="center" h="100%" pr={2}>
          <Avatar
            size="18px"
            textSizeRatio={1.7}
            round
            name={oidcUser.profile.unique_name}
            src={oidcUser.profile.picture}
          />
          <Box fontWeight="bold" px={1}>
            {oidcUser.profile.unique_name}
          </Box>
          <Icon name="chevron-down" />
        </Flex>
      </MenuButton>
      <MenuList color="gray.700">
        <MenuItem>
          <Link to={"https://id.my-shell.com/me"}> Quản lí tài khoản</Link>
        </MenuItem>
        <MenuItem onClick={() => logout()}>Đăng xuất</MenuItem>
      </MenuList>
    </Menu>
  );
};

export const PageHeader = () => {
  return (
    <Flex
      pl={2}
      color="blue.100"
      direction="row"
      h="100%"
      w="100%"
      alignItems="baseline"
    >
      <Icon color="blue.100" size="24px" name="logo" />
      <Box fontSize="lg" fontWeight="bold" pl={1}>
        IMAGES
      </Box>
      <Box flexGrow={1} />
      <UserMenu />
    </Flex>
  );
};
