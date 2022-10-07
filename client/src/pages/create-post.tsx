import { Box } from "@chakra-ui/layout";
import { Button, Heading, Center } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Container/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../util/createUrqlClient";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import { useIsAuth } from "../util/useIsAuth";
import * as yup from "yup";
import { XYCenter } from "../components/Container/XYCenter";

const schema = yup.object({
  title: yup.string().required().min(3),
  memberNo: yup.number().required().moreThan(1),
});

const CreatePost: React.FC<{}> = ({}) => {
  //router import for below, not for useIsAuth
  const router = useRouter();

  useIsAuth();
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <XYCenter>
        <Wrapper variant="small">
          <Center>
            <Heading>สร้างปาร์ตี้ใหม่</Heading>
          </Center>

          <Formik
            initialValues={{
              title: "",
              text: "",
              memberNo: 2,
              imgUrl: "",
            }}
            onSubmit={async (values) => {
              const { error } = await createPost({ input: values });
              // if there is error, the global error in craeteUrqlclient will handle it, so no need to handle here
              if (!error) {
                router.push("/");
              }
            }}
            validationSchema={schema}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="title"
                  placeholder="ชื่อปาร์ตี้"
                  label="ชื่อปาร์ตี้"
                />
                <Box mt={4}>
                  <InputField
                    textarea={true}
                    name="text"
                    placeholder="รายละเอียด"
                    label="รายละเอียด"
                  />
                </Box>

                <InputField
                  name="memberNo"
                  placeholder="จำนวนคนที่ขาด"
                  type="number"
                  label="จำนวนคนที่ขาด"
                />

                <InputField
                  name="imgUrl"
                  placeholder="https://www.example-image.com"
                  type="text"
                  label="ลิ้ง url รูปภาพ"
                />

                <Center>
                  <Button
                    mt={4}
                    type="submit"
                    isLoading={isSubmitting}
                    colorScheme="teal"
                    width="100%"
                  >
                    {" "}
                    Create Party
                  </Button>
                </Center>
              </Form>
            )}
          </Formik>
        </Wrapper>
      </XYCenter>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
