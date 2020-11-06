import React from "react";
import { IImage, imageAPI } from "resources/image";
import { SelectTags } from "./Select";
import { ImageContext } from ".";
import { FileDrop } from "react-file-drop";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  IconButtonProps,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Image,
} from "@chakra-ui/core";
import { useReactOidc } from "@axa-fr/react-oidc-context";
export interface IImageEditor extends IImage {
  onClose: () => void;
  onChange: () => void;
  onDelete: () => void;
}
interface ConfirmProps extends IconButtonProps {
  onConfirm: () => void;
  title?: string;
}
const Confirm = ({ onConfirm, title, ...props }: ConfirmProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleClose = () => setIsOpen(false);
  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };
  return (
    <>
      <IconButton {...props} onClick={() => setIsOpen(true)} />
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          {title && <ModalHeader>{title}</ModalHeader>}
          <ModalCloseButton />
          <ModalBody>
            <Box>Bạn xác nhận xóa hình ảnh này?</Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={handleConfirm}>
              Xác nhận
            </Button>
            <Button variantColor="blue" mr={3} onClick={handleClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export const ImageEditor = (props: IImageEditor) => {
  const [folder, setFolder] = React.useState<string>(props.fullname);
  const [tags, setTags] = React.useState<string[]>(props.tags);
  const { oidcUser } = useReactOidc();
  const ctx = React.useContext(ImageContext);
  const ref = React.useRef<HTMLInputElement>(null);
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolder(e.target.value);
  };
  const handleConfirmChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && props.fullname !== folder) {
      imageAPI
        .rename(props.id, folder, oidcUser.id_token)
        .then(props.onChange)
        .then(props.onChange)
        .catch();
    }
  };
  const handleFileDrop = (files: FileList | null) => {
    if (files == null) return;
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    imageAPI
      .replace(props.id, fileArray[0], oidcUser.id_token)
      .then(props.onChange);
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    handleFileDrop(files);
  };
  const openFileSelect = () => {
    ref.current?.click();
  };
  const handleAddTag = (tag: string) => {
    imageAPI
      .addTag(props.id, tag, oidcUser.id_token)
      .then(() => setTags((tags) => [...tags, tag]))
      .then(props.onChange)
      .catch();
  };
  const handleRemoveTag = (deletedTag: string) => {
    imageAPI
      .deleteTag(props.id, deletedTag, oidcUser.id_token)
      .then(() => setTags((tags) => tags.filter((tag) => tag !== deletedTag)))
      .then(props.onChange)
      .catch();
  };
  const handleDelete = () => {
    imageAPI.delete(props.id, oidcUser.id_token).then(props.onDelete).catch();
  };

  React.useEffect(() => {
    setFolder(props.fullname);
    setTags(props.tags);
  }, [props]);

  return (
    <Flex direction="column" h="100%" w="100%">
      <Flex direction="row" pb={10}>
        <Heading flexGrow={1} size="lg">
          Update
        </Heading>
        <Confirm
          mr={1}
          size="sm"
          icon="delete"
          color="red.500"
          onConfirm={handleDelete}
          aria-label="Delete"
        />
        <IconButton
          size="sm"
          icon="close"
          onClick={props.onClose}
          aria-label="Close"
        ></IconButton>
      </Flex>
      <FormControl>
        <FormLabel>Folder</FormLabel>
        <Input
          type="text"
          value={folder}
          onChange={handleFolderChange}
          onKeyPress={handleConfirmChange}
        />
      </FormControl>
      <FileDrop onDrop={handleFileDrop}>
        <Box py={2}>
          <Box
            border="1px"
            borderRadius="md"
            borderColor="gray.500"
            overflow="hidden"
          >
            <Image
              minHeight={240}
              objectFit="cover"
              onClick={openFileSelect}
              src={imageAPI.getImageLink(props)}
              alt={imageAPI.getImageLink(props)}
            />
          </Box>
        </Box>
      </FileDrop>
      <Box display="none">
        <input
          ref={ref}
          type="file"
          multiple={false}
          onChange={handleFileInputChange}
          accept="image/png"
        />
      </Box>
      <FormControl>
        <FormLabel>Tag</FormLabel>
        <SelectTags
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          tags={Array.from(ctx.tags)}
          selected={tags}
        />
      </FormControl>
    </Flex>
  );
};
