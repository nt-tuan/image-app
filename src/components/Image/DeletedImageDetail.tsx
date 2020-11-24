import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { MdClose, MdRestore } from "react-icons/md";
import { imageAPI } from "resources/api";
import { ImageHistory } from "resources/models";
import { ImageHistories } from "./ImageHistories";

interface ViewProps {
  image: ImageHistory;
  loading?: boolean;
  onRestore: () => void;
  onClose: () => void;
}
export const DeletedImageDetail = (props: ViewProps) => {
  return (
    <Flex direction="column" h="100%" w="100%">
      <Flex direction="row" pb={6}>
        <Heading flexGrow={1} size="lg">
          Detail
        </Heading>
        <HStack>
          <IconButton
            isLoading={props.loading}
            icon={<MdRestore />}
            aria-label="restore"
            onClick={props.onRestore}
          />
          <IconButton
            icon={<MdClose />}
            aria-label="close"
            onClick={props.onClose}
          />
        </HStack>
      </Flex>
      <VStack align="stretch" overflowY="auto">
        <Image
          minHeight={240}
          maxHeight={300}
          width="100%"
          objectFit="cover"
          src={imageAPI.getDeletedImageURL(props.image.backupFullname)}
          alt={props.image.fullname}
        />
        <ImageHistories id={props.image.fileID} />
      </VStack>
    </Flex>
  );
};
