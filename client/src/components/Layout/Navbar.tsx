import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  useMediaQuery,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../../generated/graphql";
import { isServer } from "../../util/isServer";
import { NavMobile } from "./NavMobile";
import { NavPC } from "./NavPC";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [isLargerThan40Em] = useMediaQuery("(min-width: 40em)");

  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={2} fontWeight={"900"}>
            ลงชื่อเข้าใช้
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white" fontWeight={"900"}>
            <Button color="blackAlpha.800">สร้างบัญชี</Button>
          </Link>
        </NextLink>
      </>
    );
  } else if (isLargerThan40Em) {
    body = (
      <NavPC data={data} logoutFetching={logoutFetching} logout={logout} />
    );
  } else {
    body = (
      <NavMobile data={data} logoutFetching={logoutFetching} logout={logout} />
    );
  }

  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      bg="#FF675C"
      p={2}
      ml={"auto"}
      align="center"
    >
      <Flex maxW={800} flex={1} align="center" m="auto">
        <NextLink href="/">
          <Link>
            <Heading color="white">Party Haan</Heading>
          </Link>
        </NextLink>

        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
