import { Box, Button, Center, Heading } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Wrapper } from "../../../components/Container/Wrapper";
import { XYCenter } from "../../../components/Container/XYCenter";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../util/createUrqlClient";
import { useGetPostId } from "../../../util/useGetPostId";

const EditPost = ({}) => {
  const router = useRouter();
  const postId = useGetPostId();
  const [{ data, fetching }] = usePostQuery({
    pause: postId === -1,
    variables: {
      id: postId,
    },
  });
  const [, updatePost] = useUpdatePostMutation();
  if (fetching) {
    return (
      <Layout>
        <div>loading ...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    //finish downloading, cannot finda post( like wrong id)
    return (
      <Layout>
        <div>could not find a post</div>
      </Layout>
    );
  }
  return (
    <Layout variant="small">
      <XYCenter>
        <Wrapper variant="small">
          <Center>
            <Heading>แก้ไข้ปาร์ตี้</Heading>
          </Center>
          <Formik
            initialValues={{
              title: data.post.title,
              text: data.post.text,
              memberNo: data.post.memberNo,
              imgUrl: data.post.imgUrl,
            }}
            onSubmit={async (values) => {
              await updatePost({ id: postId, ...values });
              router.back();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField name="title" placeholder="title" label="title" />
                <Box mt={4}>
                  {" "}
                  <InputField
                    textarea={true}
                    name="text"
                    placeholder="text..."
                    label="Body"
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

                <Button
                  mt={10}
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="teal"
                  width={"100%"}
                >
                  {" "}
                  อัปเดทปาร์ตี้
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      </XYCenter>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
