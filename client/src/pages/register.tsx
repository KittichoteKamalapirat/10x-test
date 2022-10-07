import {
  Box,
  Button,
  Center,
  Checkbox,
  FormControl,
  FormErrorMessage,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/dist/client/router";
import NextLink from "next/link";
import React from "react";
import * as yup from "yup";
import { Wrapper } from "../components/Container/Wrapper";
import { XYCenter } from "../components/Container/XYCenter";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { createUrqlClient } from "../util/createUrqlClient";
import { toErrorMap } from "../util/toErrorMap";

interface registerProps {}

const schema = yup.object({
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <XYCenter>
      <Wrapper variant="small">
        <Center mb={10}>
          <Heading>สร้างบัญชีผู้ใช้</Heading>
        </Center>

        <Formik
          initialValues={{
            email: "",
            username: "",
            password: "",
            isConsented: false,
          }}
          validationSchema={schema}
          onSubmit={async (values, { setErrors }) => {
            console.log(values);
            const response = await register({ data: values });

            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data?.register.user) {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                label="ชื่อผู้ใช้"
              />

              <Box mt={4}>
                <InputField name="email" placeholder="email" label="อีเมลล์" />
              </Box>

              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="รหัสผ่าน"
                  type="password"
                />
              </Box>

              <Box mt={4}>
                <InputField
                  name="passwordConfirm"
                  placeholder="confirm your password "
                  label="ยืนยันรหัสผ่าน"
                  type="password"
                />
              </Box>

              <Box my={5}>
                <FormControl isInvalid={!!errors}>
                  <Field
                    type="checkbox"
                    name="isConsented"
                    value="isConsented"
                    as={Checkbox}
                  />
                  <Text d="inline" ml={2} mb="1px">
                    ฉันยอมรับเงื่อนไชและข้อตกลงเกี่ยวกับการใช้งาน
                  </Text>

                  {errors ? (
                    <FormErrorMessage>{errors.isConsented}</FormErrorMessage>
                  ) : null}
                </FormControl>
              </Box>

              <Box textAlign="center" mt={5}>
                มีบัญชีแล้ว?{" "}
                <NextLink href="/login">
                  <Link fontWeight="700" color="red.400">
                    ลงชือเข้าใช้
                  </Link>
                </NextLink>
              </Box>

              <Center>
                <Button
                  mt={4}
                  width="100%"
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="teal"
                >
                  {" "}
                  สร้างบัญชี
                </Button>
              </Center>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </XYCenter>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
