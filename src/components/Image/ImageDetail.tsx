import React from "react";
import { imageAPI } from "resources/api";
import { ImageInfo } from "resources/models";
import { FileDrop } from "react-file-drop";
import { MdEdit, MdClose, MdContentCopy } from "react-icons/md";
import { ImageHistories } from "components/Image/ImageHistories";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Image,
  InputGroup,
  InputRightAddon,
  useClipboard,
  NumberInput,
  NumberInputField,
  InputLeftAddon,
  HStack,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { ImageFullscreenButton } from "./ImageFullscreenButton";
import { ImageTags } from "./ImageTags";
import { ImageContext } from "./ImageAdmin";
import {
  ImageCreatedDate,
  ImageCreator,
  ImageDiskSize,
  ImageSize,
} from "./ImageListView";

export interface IImageEditor {
  image: ImageInfo;
  onClose: () => void;
  onEdit: () => void;
}
const ResizePath = ({ image }: { image: ImageInfo }) => {
  const [size, setSize] = React.useState<{ w: number; h: number }>({
    w: 0,
    h: 0,
  });
  const originLink = React.useMemo(
    () => imageAPI.getResizedLink(image, size.w, size.h),
    [size, image]
  );
  const { onCopy: onCopyOrigin } = useClipboard(originLink);
  const webpLink = React.useMemo(
    () => imageAPI.getWebpResizedLink(image, size.w, size.h),
    [size, image]
  );
  const { onCopy: onCopyWebp } = useClipboard(webpLink);
  return (
    <>
      <Flex direction="row" alignItems="baseline">
        <FormLabel flex={1}>Resize path</FormLabel>
        <NumberInput
          size="sm"
          variant="flushed"
          onChange={(_, value) => setSize({ w: value, h: 0 })}
          w={20}
          value={size.w}
        >
          <NumberInputField />
        </NumberInput>
        <Box px={2}>&times;</Box>
        <NumberInput
          size="sm"
          variant="flushed"
          onChange={(_, value) => setSize({ w: 0, h: value })}
          w={20}
          value={size.h}
        >
          <NumberInputField />
        </NumberInput>
      </Flex>
      <FormControl size="sm">
        <InputGroup>
          <InputLeftAddon>Origin</InputLeftAddon>
          <Input
            isReadOnly
            borderRightRadius={0}
            type="text"
            value={originLink}
          />
          <InputRightAddon
            onClick={onCopyOrigin}
            cursor="pointer"
            children={<MdContentCopy />}
          />
        </InputGroup>
      </FormControl>
      <FormControl size="sm" mt={1}>
        <InputGroup>
          <InputLeftAddon>Webp</InputLeftAddon>
          <Input
            isReadOnly
            borderRightRadius={0}
            type="text"
            value={webpLink}
          />
          <InputRightAddon
            onClick={onCopyWebp}
            cursor="pointer"
            children={<MdContentCopy />}
          />
        </InputGroup>
      </FormControl>
    </>
  );
};
export const ImageDetail = (props: IImageEditor) => {
  const link = React.useMemo(() => imageAPI.getProductionLink(props.image), [
    props,
  ]);
  const ctx = React.useContext(ImageContext);
  const { onCopy } = useClipboard(link);
  return (
    <Flex direction="column" w="100%" h="100%">
      <Flex direction="row" pb={10}>
        <Heading flexGrow={1} size="lg">
          Details
        </Heading>
        <HStack>
          <ImageFullscreenButton src={link} />
          <IconButton
            size="sm"
            icon={<MdEdit />}
            onClick={props.onEdit}
            aria-label="Edit"
          ></IconButton>
          <IconButton
            size="sm"
            icon={<MdClose />}
            onClick={props.onClose}
            aria-label="Close"
          ></IconButton>
        </HStack>
      </Flex>
      <Box h={0} w="100%" flex={1} overflowY="auto" overflowX="hidden">
        <VStack align="stretch" spacing={10} pb={6}>
          <FileDrop>
            <Box w="100%">
              <FormLabel>Hình ảnh</FormLabel>
              <Box
                w="100%"
                border="1px"
                borderRadius="md"
                borderColor="gray.500"
                overflow="hidden"
              >
                <Image
                  height={300}
                  width="100%"
                  objectFit="cover"
                  src={imageAPI.getPreviewLink(props.image)}
                  alt={props.image.fullname}
                />
              </Box>
            </Box>
          </FileDrop>
          <Box>
            <FormLabel>Thông số</FormLabel>
            <Wrap spacing={4} justify="center">
              <WrapItem>
                <ImageSize {...props.image} />
              </WrapItem>
              <WrapItem>
                <ImageDiskSize {...props.image} />
              </WrapItem>
              <WrapItem>
                <ImageCreator {...props.image} />
              </WrapItem>
              <WrapItem>
                <ImageCreatedDate {...props.image} />
              </WrapItem>
            </Wrap>
          </Box>
          <FormControl size="sm">
            <FormLabel>File path</FormLabel>
            <InputGroup>
              <Input
                isReadOnly
                borderRightRadius={0}
                type="text"
                value={link}
              />
              <InputRightAddon
                onClick={onCopy}
                cursor="pointer"
                children={<MdContentCopy />}
              />
            </InputGroup>
          </FormControl>
          <Box w="100%">
            <ResizePath image={props.image} />
          </Box>

          {props.image.tags && props.image.tags.length > 0 && (
            <FormControl w="100%">
              <FormLabel>Tags</FormLabel>
              <ImageTags
                tags={props.image.tags}
                onClick={(tag) =>
                  ctx && ctx.selectedTags && ctx.setSelectedTags(new Set([tag]))
                }
              />
            </FormControl>
          )}
          <Box w="100%">
            <ImageHistories id={props.image.id} />
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};
