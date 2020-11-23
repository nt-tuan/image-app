import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { ImageTags } from "./ImageTags";
import { ImageListItemProps } from "./ImageList";
interface Props {
  images: ImageListItemProps[];
  onSelect: (image: ImageListItemProps) => void;
  onTagSelect?: (tag: string) => void;
}
export const ImagesGridView = ({ images, onSelect, onTagSelect }: Props) => (
  <SimpleGrid
    minChildWidth={{ base: "100px", lg: "200px" }}
    spacing={6}
    pt={1}
    pb={10}
  >
    {images.map((image) => (
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
                key={image.id.toString()}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
                effect="blur"
                width="100%"
                height="100%"
                src={image.href}
                onClick={() => onSelect(image)}
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
                <ImageTags tags={image.tags} onClick={onTagSelect} />
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
