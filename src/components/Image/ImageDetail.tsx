import React from "react";
import { imageAPI } from "resources/api";
import { IImage } from "resources/models";
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
  Tag,
  InputGroup,
  InputRightAddon,
  useClipboard,
  NumberInput,
  NumberInputField,
  InputLeftAddon,
  HStack,
} from "@chakra-ui/react";
import { ImageFullscreenButton } from "./ImageFullscreenButton";

export interface IImageEditor {
  image: IImage;
  onClose: () => void;
  onEdit: () => void;
}
const ResizePath = ({ image }: { image: IImage }) => {
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
  const { onCopy } = useClipboard(link);
  return (
    <Flex direction="column" h="100%" w="100%">
      <Flex direction="row" pb={6}>
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
      <FormControl size="sm">
        <FormLabel>File path</FormLabel>
        <InputGroup>
          <Input isReadOnly borderRightRadius={0} type="text" value={link} />
          <InputRightAddon
            onClick={onCopy}
            cursor="pointer"
            children={<MdContentCopy />}
          />
        </InputGroup>
      </FormControl>
      <ResizePath image={props.image} />
      <FileDrop>
        <Box py={2}>
          <Box
            border="1px"
            borderRadius="md"
            borderColor="gray.500"
            overflow="hidden"
          >
            <Image
              minHeight={240}
              maxHeight={300}
              width="100%"
              objectFit="cover"
              src={imageAPI.getPreviewLink(props.image)}
              alt={imageAPI.getPreviewLink(props.image)}
            />
          </Box>
        </Box>
      </FileDrop>
      {props.image.tags && props.image.tags.length > 0 && (
        <FormControl>
          <FormLabel>Tags</FormLabel>
          {props.image.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </FormControl>
      )}
      <Box pt={12}>
        <ImageHistories id={props.image.id} />
      </Box>
    </Flex>
  );
};
