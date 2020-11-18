import { Box, Flex, Spacer, StackDivider, VStack } from "@chakra-ui/react";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ImageListItemProps } from "./ImageList";
import { ImageTags } from "./ImageTags";
interface Props {
  images: ImageListItemProps[];
  onSelect: (image: ImageListItemProps) => void;
}
export const ImageListView = ({ images, onSelect }: Props) => (
  <VStack
    divider={<StackDivider borderColor="gray.200" />}
    spacing={0}
    align="stretch"
  >
    {images.map((image) => (
      <Flex
        key={image.id}
        h={12}
        direction="row"
        cursor="pointer"
        _hover={{ bgColor: "gray.200" }}
        onClick={() => onSelect(image)}
      >
        <Box h={12} w={16} p={1}>
          <Box
            w="100%"
            h="100%"
            border="1px"
            borderRadius="md"
            borderColor="gray.500"
          >
            <LazyLoadImage
              key={image.id.toString()}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
              effect="blur"
              height="100%"
              width="100%"
              src={image.href}
              onClick={() => onSelect(image)}
              alt={`${image.fullname} ${image.tags.join(",")}`}
            />
          </Box>
        </Box>
        <Flex direction="column" flex={1} pl={2}>
          <Flex flex={1} w="100%" direction="row" alignItems="baseline">
            <Box fontWeight="bold" fontSize="lg">
              {image.fullname}
            </Box>
            <Spacer />
            <ImageTags tags={image.tags} />
          </Flex>
          <Box fontSize="sm" color="gray.400">
            {/* {image.at} - {image.by} */}
            --
          </Box>
        </Flex>
      </Flex>
    ))}
  </VStack>
);
