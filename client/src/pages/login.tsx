import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, Center, Flex, Image, Link } from "@chakra-ui/react";

import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../util/toErrorMap";
import { useRouter } from "next/dist/client/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../util/createUrqlClient";
import NextLink from "next/link";
import { Wrapper } from "../components/Container/Wrapper";
import { XYCenter } from "../components/Container/XYCenter";

export const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  console.log(router);
  const [, login] = useLoginMutation();
  return (
    <XYCenter>
      <Wrapper variant="small">
        <Center m={10}>
          <Image
            boxSize="200px"
            objectFit="cover"
            src="https://xxx.com"
            alt="Logo"
            fallbackSrc="https://via.placeholder.com/150"
          />
        </Center>

        <Formik
          initialValues={{
            usernameOrEmail: "",
            password: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            console.log(values);
            const response = await login(values);
            // └ has to match what defined in graphqlmutation
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              // work we get the user!
              // If login, push to the previoius page
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                router.push("/");
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="usernameOrEmail"
                placeholder="username or email"
                label="อีเมล หรือ ชื่อผู้ใช้"
              />
              <Box mt={4}>
                {" "}
                <InputField
                  name="password"
                  placeholder="password"
                  label="รหัสผ่าน"
                  type="password"
                />
              </Box>
              <Flex>
                {" "}
                <NextLink href="/forgot-password">
                  <Link ml={"auto"}>ลืมรหัสผ่าน?</Link>
                </NextLink>
              </Flex>

              <Box textAlign="center" mt={5}>
                ยังไม่มีบัญชี?{" "}
                <NextLink href="/register">
                  <Link fontWeight="700" color="red.400">
                    สร้างบัญชีผู้ใช้
                  </Link>
                </NextLink>
              </Box>

              <Button
                mt={4}
                width="100%"
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                เข้าสู่ระบบ
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </XYCenter>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
