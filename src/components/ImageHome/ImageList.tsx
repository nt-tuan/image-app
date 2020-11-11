import React from "react";
import { imageAPI } from "resources/image";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ImageContext } from ".";
import { Box, Flex, SimpleGrid, Spinner, Tag } from "@chakra-ui/core";

export const ImageList = () => {
  const { filtered, setSelected } = React.useContext(ImageContext);
  if (filtered == null) {
    return (
      <Flex w="100%" direction="column" alignItems="center">
        <Spinner color="blue.500" />
      </Flex>
    );
  }
  if (filtered.length === 0)
    return (
      <div className="flex w-full inline-block text-center h-64">
        <span className="my-auto mx-auto">Không có hình ảnh nào</span>
      </div>
    );
  return (
    <SimpleGrid minChildWidth="300px" spacing={10}>
      {filtered.map((image) => (
        <Flex h={200} key={image.id} direction="column">
          <Flex
            direction="column"
            cursor="pointer"
            key={image.id}
            flexGrow={1}
            border="1px"
            borderRadius="md"
            borderColor="gray.500"
            overflow="hidden"
          >
            <Box flexGrow={1} position="relative" w="100%">
              <Box position="absolute" top={0} bottom={0} right={0} left={0}>
                <LazyLoadImage
                  key={image.id + image.time.getTime()}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                  effect="blur"
                  width="100%"
                  height="100%"
                  src={imageAPI.getPreviewLink(image)}
                  onClick={() =>
                    setSelected && setSelected({ ...image, mode: "view" })
                  }
                  alt={`${image.fullname} ${image.tags.join(",")}`}
                />
              </Box>
              <Box
                position="absolute"
                p={1}
                top={0}
                left={0}
                right={0}
                overflow="hidden"
              >
                <Flex direction="row" flexWrap="wrap">
                  {image.tags.map((tag) => (
                    <Tag
                      key={tag}
                      size="sm"
                      mr="1"
                      opacity={0.7}
                      mb={1}
                      isTruncated
                    >
                      {tag}
                    </Tag>
                  ))}
                </Flex>
              </Box>
            </Box>
          </Flex>
          <Box isTruncated fontSize="sm" pr={2}>
            {image.fullname}
          </Box>
        </Flex>
      ))}
    </SimpleGrid>
  );
};
