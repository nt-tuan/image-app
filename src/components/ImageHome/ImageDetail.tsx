import React from "react";
import { IImage, imageAPI } from "resources/image";
import { FileDrop } from "react-file-drop";
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
} from "@chakra-ui/core";
export interface IImageEditor {
  image: IImage;
  onClose: () => void;
  onEdit: () => void;
}

export const ImageDetail = (props: IImageEditor) => {
  return (
    <Flex direction="column" h="100%" w="100%">
      <Flex direction="row" pb={10}>
        <Heading flexGrow={1} size="lg">
          Details
        </Heading>
        <IconButton
          size="sm"
          icon="edit"
          mr={1}
          onClick={props.onEdit}
          aria-label="Edit"
        ></IconButton>
        <IconButton
          size="sm"
          icon="close"
          onClick={props.onClose}
          aria-label="Close"
        ></IconButton>
      </Flex>
      <FormControl>
        <FormLabel>File path</FormLabel>
        <Input
          isReadOnly
          type="text"
          value={imageAPI.getProductionLink(props.image)}
        />
      </FormControl>
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
    </Flex>
  );
};
