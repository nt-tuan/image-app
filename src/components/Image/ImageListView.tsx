import {
  Box,
  Flex,
  Spacer,
  StackDivider,
  VStack,
  Icon,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import {
  MdAccessTime,
  MdAccountCircle,
  MdHelpOutline,
  MdPhotoSizeSelectActual,
  MdStorage,
} from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ImageListItemProps } from "./ImageList";
import { ImageTags } from "./ImageTags";
import Moment from "react-moment";
interface Props {
  images: ImageListItemProps[];
  onSelect: (image: ImageListItemProps) => void;
  onTagSelect?: (tag: string) => void;
}
export const ImageListView = ({ images, onSelect, onTagSelect }: Props) => (
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
            <ImageTags tags={image.tags} onClick={onTagSelect} />
          </Flex>
          <Box fontSize="sm" color="gray.400">
            <HStack spacing={3}>
              {image.width && image.height && (
                <HStack spacing={1}>
                  <Icon as={MdPhotoSizeSelectActual} />
                  <Box>
                    {image.width} &times; {image.height}
                  </Box>
                </HStack>
              )}
              {image.diskSize && (
                <HStack spacing={1}>
                  <Icon as={MdStorage} />
                  <Box>{image.diskSize}</Box>
                </HStack>
              )}
              {image.by && (
                <HStack spacing={1}>
                  <Icon as={MdAccountCircle} />
                  <Box>{image.by}</Box>
                </HStack>
              )}
              {image.at && (
                <HStack spacing={1}>
                  <Icon as={MdAccessTime} />
                  <Moment fromNow>{image.at}</Moment>
                </HStack>
              )}
              {!image.at && !image.by && <Icon as={MdHelpOutline} />}
            </HStack>
          </Box>
        </Flex>
      </Flex>
    ))}
  </VStack>
);
