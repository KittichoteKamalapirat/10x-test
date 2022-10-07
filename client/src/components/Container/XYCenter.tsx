import { Box, Flex } from "@chakra-ui/react";
import React from "react";

interface XYCenterProps {}

export const XYCenter: React.FC<XYCenterProps> = ({ children }) => {
  return (
    <Flex alignItems="center" justifyContent="center" height="80vh">
      {children}
    </Flex>
  );
};
