import React from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
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
  Link as UILink,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { MdKeyboardArrowDown, MdImage, MdRestore } from "react-icons/md";
import { LogoIcon } from "./LogoIcon";

const UserMenu = () => {
  const visible = useBreakpointValue({ base: false, md: true });
  const { oidcUser, logout } = useReactOidc();
  if (oidcUser == null) return <Button variant="ghost">Đăng nhập</Button>;
  return (
    <Menu>
      <MenuButton as={Box} alignSelf="center">
        <Flex direction="row" justify="end" alignItems="center" h="100%" pr={2}>
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
  icon: React.ReactElement;
}) => {
  const location = useLocation();
  const visible = useBreakpointValue({ base: false, md: true });
  const active = React.useMemo(() => {
    const match = matchPath(location.pathname, path);
    return match && match.isExact;
  }, [location, path]);
  return (
    <UILink
      px={2}
      fontSize="lg"
      color={active ? "white" : "blue.300"}
      fontWeight="bold"
      href={path}
    >
      <HStack spacing={2}>
        {icon}
        {visible && <Box>{children}</Box>}
      </HStack>
    </UILink>
  );
};

export const PageHeader = () => {
  return (
    <Flex
      h={12}
      bg="blue.500"
      pl={2}
      color="blue.100"
      direction="row"
      w="100%"
      alignItems="baseline"
    >
      <Flex direction="row" alignItems="baseline">
        <LogoIcon color="blue.100" boxSize="32px" name="logo" />
        <Box fontSize="2xl" fontWeight="bold" pl={1} pr={2}>
          IMAGES
        </Box>
      </Flex>
      <NavItem icon={<MdImage />} path="/app">
        {" "}
        Images
      </NavItem>
      <NavItem icon={<MdRestore />} path="/app/trash">
        Trash
      </NavItem>
      <Flex flexGrow={1} alignSelf="baseline" alignItems="baseline"></Flex>
      <UserMenu />
    </Flex>
  );
};
