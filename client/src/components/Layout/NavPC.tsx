import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Flex,
  Button,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import NextLink from "next/link";
import { MeQuery } from "../../generated/graphql";

interface NavPCProps {
  data: MeQuery;
  logoutFetching: boolean;
  logout: Function;
}

export const NavPC: React.FC<NavPCProps> = ({
  data,
  logoutFetching,
  logout,
}) => {
  return (
    <Flex align="center">
      <NextLink href="/create-post">
        <Button as={Link} mx={6} fontWeight={700}>
          สร้างปาร์ตี้ใหม่
        </Button>
      </NextLink>

      <Text mx={6} color="white" fontWeight={"600"}>
        Welcome {data.me!.username}
      </Text>

      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<HamburgerIcon />}
          bgColor="transparent"
          color="white"
        />
        <MenuList>
          <MenuItem>
            {" "}
            <Button
              mx={6}
              variant={"link"}
              color="blackAlpha.700"
              onClick={async () => {
                await logout();
                router.reload();
              }}
              isLoading={logoutFetching}
            >
              logout
            </Button>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
