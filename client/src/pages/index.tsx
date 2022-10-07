import { Link } from "@chakra-ui/layout";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { ContentWrapper } from "../components/Container/ContentWrapper";
import { Layout } from "../components/Layout";
import { UpvoteSection } from "../components/UpvoteSection";
import { usePostsQuery } from "../generated/graphql";
import { randomMockData } from "../randomMockData";
import { createUrqlClient } from "../util/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 20,
    cursor: null as null | string,
  });
  const mockData = randomMockData;

  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <div>
        <div>query failed</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      <ContentWrapper>
        <Center>
          <Heading mb={4}>ปาร์ตี้ทั้งหมด</Heading>
        </Center>

        {!data && fetching ? (
          <div>loading ... </div>
        ) : (
          <Grid templateColumns={["repeat(2, 1fr)"]} gap={6}>
            {[...data!.posts.posts, ...mockData].map((post) =>
              !post ? null : (
                <Flex
                  flexDirection={["column", "column", "column", "row"]}
                  key={post.id}
                  boxShadow="base"
                >
                  <Image
                    src={post.imgUrl!}
                    alt="Example image"
                    fallbackSrc="https://via.placeholder.com/150"
                    width="100%"
                    maxW={["none", "none", "none", "200px"]}
                    height={["50vw", "50vw", "50vw", "200px"]}
                  />
                  <Box width={"100%"}>
                    <Flex key={post.id} m={2}>
                      <UpvoteSection post={post} />

                      <Box flex={1}>
                        <NextLink
                          href={{
                            pathname: "/post/[id]",
                            query: { id: post.id },
                          }}
                        >
                          <Link>
                            <Heading fontSize="xl">{post.title}</Heading>
                          </Link>
                        </NextLink>

                        <Text>by {post.creator.username}</Text>

                        <Text mt={4}>{post.textSnippet}</Text>
                      </Box>
                    </Flex>
                    <Flex
                      justifyContent={[
                        "space-between",
                        "space-between",
                        "flex-end",
                      ]}
                      alignItems={"center"}
                      m={2}
                    >
                      <Text mx={2}>
                        {post.memberNo - 2}/{post.memberNo} คน
                      </Text>

                      <Button colorScheme="teal" width={["50%", "30%"]}>
                        Join
                      </Button>
                    </Flex>
                  </Box>
                </Flex>
              )
            )}
          </Grid>
        )}

        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                });
              }}
              isLoading={fetching}
              bgColor="lightgrey"
              m="auto"
              my={8}
            >
              load more
            </Button>
          </Flex>
        ) : null}
      </ContentWrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
