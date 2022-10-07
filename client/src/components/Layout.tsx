import React from "react";
import { WrapperVariant, Wrapper } from "./Container/Wrapper";
import { Navbar } from "./Layout/Navbar";

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <Navbar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
