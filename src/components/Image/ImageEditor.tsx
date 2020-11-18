import React from "react";
import { imageAPI } from "resources/api";
import { IImage } from "resources/models";
import { SelectTags } from "./Select";
import { ImageContext } from "./ImageAdmin";
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { MdDelete, MdClose } from "react-icons/md";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import ReactCompareImage from "react-compare-image";
export interface IImageEditor {
  image: IImage;
  onClose: () => void;
  onChange: () => void;
  onDelete: () => void;
}
interface ConfirmProps extends IconButtonProps {
  onConfirm: () => void;
  title?: string;
}
const RenameConfirm = ({
  open,
  oldPath,
  newPath,
  onConfirm,
  onClose,
}: {
  open: boolean;
  oldPath: string;
  newPath: string;
  onConfirm: () => void;
  onClose: () => void;
}) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog isOpen={open} onClose={onClose} leastDestructiveRef={ref}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Bạn xác nhận muốn đổi hình đường dẫn hình ảnh này?
        </AlertDialogHeader>
        <AlertDialogBody>
          <Box color="red.500">
            <strong>Đường dẫn cũ: </strong>
            {oldPath}
          </Box>
          <Box color="green.500">
            <strong>Đường dẫn mới: </strong>
            {newPath}
          </Box>
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button variant="ghost" onClick={onConfirm} ml={3}>
            Xác nhận
          </Button>
          <Button variantColor="blue" ref={ref} onClick={onClose}>
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
const ReplaceCofirm = ({
  image,
  file,
  onClose,
  onConfirm,
}: {
  image: IImage;
  file?: File;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog
      isOpen={file != null}
      onClose={onClose}
      leastDestructiveRef={ref}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Đổi hình ảnh
        </AlertDialogHeader>
        <AlertDialogBody>
          Bạn có chắc chắn muốn đổi hình ảnh chứ?
          {file && (
            <ReactCompareImage
              leftImage={imageAPI.getPreviewLink(image)}
              leftImageLabel="Hình cũ"
              rightImage={URL.createObjectURL(file)}
              rightImageLabel="Hình mới"
            />
          )}
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button variant="ghost" onClick={onConfirm} ml={3}>
            Xác nhận
          </Button>
          <Button variantColor="blue" ref={ref} onClick={onClose}>
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
const DeleteButton = ({ onConfirm, title, ...props }: ConfirmProps) => {
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
  const [folder, setFolder] = React.useState<string>("");
  const [tags, setTags] = React.useState<string[]>(props.image.tags);
  const [imageKey, setImageKey] = React.useState(new Date().getTime());
  const [replacedFile, setReplacedFile] = React.useState<File>();
  const [confirmRename, setConfirmRename] = React.useState(false);
  const { oidcUser } = useReactOidc();
  const ctx = React.useContext(ImageContext);
  const ref = React.useRef<HTMLInputElement>(null);
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolder(e.target.value);
  };
  const handleConfirmRename = () =>
    imageAPI
      .rename(props.image.id, folder, oidcUser.access_token)
      .then(props.onChange)
      .then(() => setConfirmRename(false))
      .catch();
  const handleNotConfirmRename = () => {
    setConfirmRename(false);
    setFolder(props.image.fullname);
  };

  const handleFilepathKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && props.image.fullname !== folder) {
      setConfirmRename(true);
    }
  };
  const handleReplaceFile = async () => {
    if (replacedFile == null) return;
    await imageAPI.replace(props.image.id, replacedFile, oidcUser.access_token);
    await imageAPI.purgeCache(props.image.id, oidcUser.access_token);
    setReplacedFile(undefined);
    setImageKey(new Date().getTime());
    props.onChange();
  };
  const handleFileDrop = (files: FileList | null) => {
    if (files == null) return;
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    setReplacedFile(fileArray[0]);
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
      .addTag(props.image.id, tag, oidcUser.access_token)
      .then(() => setTags((tags) => [...tags, tag]))
      .then(props.onChange)
      .catch();
  };
  const handleRemoveTag = (deletedTag: string) => {
    imageAPI
      .deleteTag(props.image.id, deletedTag, oidcUser.access_token)
      .then(() => setTags((tags) => tags.filter((tag) => tag !== deletedTag)))
      .then(props.onChange)
      .catch();
  };
  const handleDelete = () => {
    imageAPI
      .delete(props.image.id, oidcUser.access_token)
      .then(props.onDelete)
      .catch();
  };

  React.useEffect(() => {
    setFolder(props.image.fullname);
    setTags(props.image.tags);
  }, [props]);
  return (
    <Flex direction="column" h="100%" w="100%">
      <Flex direction="row" pb={10}>
        <Heading flexGrow={1} size="lg">
          Update
        </Heading>
        <DeleteButton
          mr={1}
          size="sm"
          icon={<MdDelete />}
          color="red.500"
          onConfirm={handleDelete}
          aria-label="Delete"
        />
        <IconButton
          size="sm"
          icon={<MdClose />}
          onClick={props.onClose}
          aria-label="Close"
        ></IconButton>
      </Flex>
      <RenameConfirm
        oldPath={props.image.fullname}
        newPath={folder}
        open={confirmRename}
        onClose={handleNotConfirmRename}
        onConfirm={handleConfirmRename}
      />
      <FormControl>
        <FormLabel>File path</FormLabel>
        <InputGroup>
          <InputLeftAddon>./</InputLeftAddon>
          <Input
            roundedLeft={0}
            type="text"
            value={folder}
            onChange={handleFolderChange}
            onBlur={() => setConfirmRename(true)}
            onKeyPress={handleFilepathKeyPress}
          />
        </InputGroup>
      </FormControl>
      <FileDrop onDrop={handleFileDrop}>
        <ReplaceCofirm
          onClose={() => setReplacedFile(undefined)}
          onConfirm={handleReplaceFile}
          file={replacedFile}
          image={props.image}
        />
        <Box py={2}>
          <Box
            border="1px"
            borderRadius="md"
            borderColor="gray.500"
            overflow="hidden"
          >
            <Image
              key={imageKey}
              minHeight={240}
              maxHeight={300}
              width="100%"
              objectFit="cover"
              onClick={openFileSelect}
              src={imageAPI.getPreviewLink(props.image)}
              alt={imageAPI.getPreviewLink(props.image)}
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
