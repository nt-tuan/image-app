import {
  Box,
  Flex,
  StackDivider,
  VStack,
  Icon,
  HStack,
  Avatar,
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import {
  MdHelpOutline,
  MdPhotoSizeSelectActual,
  MdStorage,
  MdDateRange,
} from "react-icons/md";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ImageTags } from "components/tag/ImageTags";
import Moment from "react-moment";
import { ImageListItemProps } from "components/image/list/ItemProps";
interface Props {
  images: ImageListItemProps[];
  onSelect: (image: ImageListItemProps) => void;
  onTagSelect?: (tag: string) => void;
}
interface ItemProps {
  image: ImageListItemProps;
}
// Create our number formatter.
const formatter = new Intl.NumberFormat("vi-VN");
export const ImageDiskSize = ({ diskSize }: { diskSize?: number }) => (
  <>
    {diskSize && (
      <HStack spacing={1}>
        <Icon as={MdStorage} />
        <Box>{formatter.format(Math.floor(diskSize / 1000))}KB</Box>
      </HStack>
    )}
  </>
);
export const ImageSize = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => (
  <>
    {width && height && (
      <HStack spacing={1}>
        <Icon as={MdPhotoSizeSelectActual} />
        <Box>
          {width} &times; {height}
        </Box>
      </HStack>
    )}
  </>
);

export const ImageCreator = ({ by }: { by?: string }) => (
  <>
    {by && (
      <HStack spacing={1}>
        <Avatar size="2xs" name={by} />
        <Box>{by}</Box>
      </HStack>
    )}
  </>
);

export const ImageCreatedDate = ({ at }: { at?: string }) => (
  <>
    {at && (
      <HStack spacing={1}>
        <Icon as={MdDateRange} />
        <Moment fromNow>{at}</Moment>
      </HStack>
    )}
  </>
);

const ImageMeta = ({ image }: ItemProps) => {
  const visible = useBreakpointValue({ base: false, md: true });
  return (
    <HStack fontSize="sm" color="gray.400" spacing={3}>
      <ImageSize {...image} />
      <ImageDiskSize {...image} />
      {visible && <ImageCreator {...image} />}
      {visible && <ImageCreatedDate {...image} />}
      {!image.at && !image.by && <Icon as={MdHelpOutline} />}
    </HStack>
  );
};
export const ImageListView = ({ images, onSelect, onTagSelect }: Props) => (
  <VStack
    divider={<StackDivider borderColor="gray.200" />}
    spacing={0}
    align="stretch"
  >
    {images.map((image) => (
      <Flex
        key={image.id}
        direction="row"
        cursor="pointer"
        _hover={{ bgColor: "gray.200" }}
        onClick={() => onSelect(image)}
        py={1}
      >
        <Box h={12} w={16} py={1}>
          <Box
            w="100%"
            h="100%"
            border="1px"
            borderRadius="md"
            borderColor="gray.500"
            overflow="hidden"
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
        <Flex direction="column" w={0} flex={1} pl={2} justify="stretch">
          <Flex flex={1} direction="row" alignItems="baseline" wrap="wrap">
            <Box
              maxWidth="100%"
              flex={1}
              wordBreak="break-all"
              fontWeight="bold"
              fontSize="lg"
            >
              {image.fullname}
            </Box>
            <ImageTags tags={new Set(image.tags)} onClick={onTagSelect} />
          </Flex>
          <ImageMeta image={image} />
        </Flex>
      </Flex>
    ))}
  </VStack>
);
