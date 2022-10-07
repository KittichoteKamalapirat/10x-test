import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { ContentWrapper } from "../../components/Container/ContentWrapper";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { useMeQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../util/createUrqlClient";
import { useGetPostFromUrl } from "../../util/useGetPostFromUrl";

const Post = ({}) => {
  const [{ data, fetching }] = useGetPostFromUrl();
  const [{ data: meData }] = useMeQuery();

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
    <Layout>
      <Box mb={20}>
        <ContentWrapper>
          {meData?.me?.id !== data.post.creator.id ? null : (
            <Flex justifyContent={"flex-end"}>
              <EditDeletePostButtons id={data.post.id} />
            </Flex>
          )}

          <Flex flexDirection={["column", "column", "row"]}>
            <Box>
              <Center>
                <Heading mb={4}>{data?.post?.title}</Heading>
              </Center>
              <Center>
                <Image
                  src={data?.post?.imgUrl!}
                  alt="Example image"
                  fallbackSrc="https://via.placeholder.com/150"
                  width="50%"
                />
              </Center>
            </Box>
            <Box m={10}>
              <Heading fontSize={"xl"}>รายละเอียด</Heading>
              <Text mb={4}> {data?.post?.text}</Text>
              <Flex
                justifyContent={["space-between", "space-between", "flex-end"]}
                alignItems={"center"}
                m={2}
              ></Flex>
            </Box>
          </Flex>
        </ContentWrapper>
      </Box>

      {/* bottom bar */}
      <Box
        zIndex={1}
        position="fixed"
        bottom={[0, 0, null, null]}
        right={[0, 0, 0, 0]}
        bgColor="white"
        ml={"auto"}
        align="center"
        width="100%"
        justifyContent="center"
        boxShadow="xs"
      >
        <Box width="90%" py={4} maxW={[null, "40%"]} fontWeight="bold">
          <Flex justifyContent="space-between" py={2}>
            <Text>จำนวนสมาชิก</Text>
            <Text mx={2}>
              {data?.post?.memberNo - 2}/{data?.post?.memberNo} คน
            </Text>
          </Flex>

          <Button p={3} colorScheme={"teal"} color="white" width="100%">
            Join
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post); //want good SEO
