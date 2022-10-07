import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Container/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../util/createUrqlClient";
import { toErrorMap } from "../../util/toErrorMap";
import NextLink from "next/link";

export const ChangePassword: NextPage<{ token: string }> = () => {
  const router = useRouter();

  console.log(router.query);
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          newPassword: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });

          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            } else {
              setErrors(errorMap);
            }
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              {" "}
              <InputField
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type="password"
              />
            </Box>
            {tokenError ? (
              <Flex>
                <Box x color="red" mr={2}>
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>Get another one</Link>
                </NextLink>
              </Flex>
            ) : null}

            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              {" "}
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
