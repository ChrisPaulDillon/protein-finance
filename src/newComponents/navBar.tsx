import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import UnlockButton from "../components/UnlockButton";
import { useWeb3React } from "@web3-react/core";
import useAuth from "../hooks/useAuth";
import { DarkModeButton } from "newComponents/DarkModeButton";
import PriceImageToken from "./PriceImageToken";
import { useLocation } from "react-router-dom";

const Links = ["Docs", "Farm", "Dashboard"];

const NavLink = ({ href, children }) => {
  const location = useLocation();

  const linkColour = (): string => {
    if (location.pathname === href) {
      return "green";
    } else {
      return "white";
    }
  };

  return (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={href}
      color={linkColour()}
    >
      <Heading fontSize="lg" fontWeight="extrabold">
        {children}
      </Heading>
    </Link>
  );
};

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account } = useWeb3React();
  const { logout } = useAuth();

  return (
    <>
      <Box
        bgGradient={useColorModeValue(
          "gray.900",
          "linear(to bottom, #292929, #282828, #272727, #262626, #252525)"
        )}
        px={4}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"} w="100%" ml={2}>
            <PriceImageToken />
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
              justify="center"
              alignItems="center"
              alignContent="center"
              w="100%"
            >
              {Links.map((link) => (
                <NavLink key={link} href={`/${link}`}>
                  {link}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"} justifyContent="space-between">
            {account && (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                >
                  <UnlockButton />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            )}
            {!account && <UnlockButton />}
            <Box ml={2}>
              <DarkModeButton />
            </Box>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link} href={`/${link}`}>
                  {link}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default NavBar;
