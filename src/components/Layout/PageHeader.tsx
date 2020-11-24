import React from "react";
import { Link, useLocation, matchPath, useHistory } from "react-router-dom";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import Avatar from "react-avatar";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  HStack,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";

import { MdKeyboardArrowDown, MdImage, MdRestore } from "react-icons/md";
import { LogoIcon } from "./LogoIcon";
import { IconType } from "react-icons";

const UserMenu = () => {
  const visible = useBreakpointValue({ base: false, md: true });
  const { oidcUser, logout } = useReactOidc();
  if (oidcUser == null) return <Button variant="ghost">Đăng nhập</Button>;
  return (
    <Menu>
      <MenuButton as={Box} alignSelf="center" pr={2}>
        <Flex direction="row" justify="end" alignItems="center" h="100%">
          <Avatar
            size="28"
            textSizeRatio={1.7}
            round
            name={oidcUser.profile.unique_name}
            src={oidcUser.profile.picture}
          />
          {visible && (
            <Box fontWeight="bold" px={1}>
              {oidcUser.profile.unique_name}
            </Box>
          )}
          <Icon as={MdKeyboardArrowDown} />
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

const NavItem = ({
  children,
  path,
  icon,
}: {
  children: React.ReactNode;
  path: string;
  icon: IconType;
}) => {
  const history = useHistory();
  const location = useLocation();
  const visible = useBreakpointValue({ base: false, md: true });
  const active = React.useMemo(() => {
    const match = matchPath(location.pathname, path);
    return match && match.isExact;
  }, [location, path]);
  return (
    <HStack
      h="100%"
      fontSize="lg"
      color={active ? "white" : "blue.300"}
      fontWeight="bold"
      cursor="pointer"
      onClick={() => history.push(path)}
    >
      <Icon boxSize="24px" as={icon} />
      {visible && <Box as="span">{children}</Box>}
    </HStack>
  );
};

export const PageHeader = () => {
  return (
    <Flex
      h={12}
      bg="blue.500"
      color="blue.100"
      direction="row"
      w="100%"
      overflowX="hidden"
    >
      <Flex direction="row" alignItems="baseline" pl={4}>
        <LogoIcon color="blue.100" boxSize="32px" name="logo" />
        <Box fontSize="2xl" fontWeight="bold" pl={1} pr={8}>
          IMAGES
        </Box>
      </Flex>
      <HStack align="baseline" spacing={4}>
        <NavItem icon={MdImage} path="/app">
          {" "}
          Images
        </NavItem>
        <NavItem icon={MdRestore} path="/app/trash">
          Trash
        </NavItem>
      </HStack>
      <Box w={0} flex={1} />
      <UserMenu />
    </Flex>
  );
};
