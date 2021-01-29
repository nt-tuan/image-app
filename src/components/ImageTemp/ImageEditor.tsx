import React from "react";
import { imageAPI, RequestError } from "resources/api";
import { ImageInfo } from "resources/models";
import { SelectTags } from "../tag/Select";
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
  Icon,
  VStack,
  HStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { MdHelp, MdDelete, MdClose } from "react-icons/md";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import ReactCompareImage from "react-compare-image";
import { User } from "oidc-client";
import { ErrorAlert } from "components/ErrorAlert";
export interface IImageEditor {
  image: ImageInfo;
  onClose: () => void;
  onChange: () => void;
  onDelete: () => void;
}
interface ConfirmProps extends IconButtonProps {
  onConfirm: () => void;
  title?: string;
}
const LoadingAlertDialogBody = ({
  loading,
  title,
  children,
}: {
  loading: boolean;
  title: string;
  children: React.ReactNode;
}) => {
  if (loading)
    return (
      <AlertDialogBody>
        <Center>
          <Spinner colorScheme="blue" />
          {title}
        </Center>
      </AlertDialogBody>
    );
  return <AlertDialogBody>{children}</AlertDialogBody>;
};
const RenameConfirm = ({
  open,
  image,
  newPath,
  oidcUser,
  onConfirm,
  onClose,
}: {
  open: boolean;
  image: ImageInfo;
  newPath: string;
  oidcUser: User;
  onConfirm: () => void;
  onClose: () => void;
}) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<RequestError>();
  const handleConfirmRename = async () => {
    try {
      setLoading(true);
      await imageAPI.rename(image.id, newPath, oidcUser.access_token);
      onConfirm();
    } catch (err) {
      setErr(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog isOpen={open} onClose={onClose} leastDestructiveRef={ref}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Bạn xác nhận muốn đổi hình đường dẫn hình ảnh này?
        </AlertDialogHeader>
        {err && (
          <ErrorAlert
            title="Đổi tên hình ảnh không thành công"
            description={err.Err}
            onClose={() => setErr(undefined)}
          />
        )}
        <LoadingAlertDialogBody title="Đang cập nhật" loading={loading}>
          <Box color="red.500">
            <strong>Đường dẫn cũ: </strong>
            {image.fullname}
          </Box>
          <Box color="green.500">
            <strong>Đường dẫn mới: </strong>
            {newPath}
          </Box>
        </LoadingAlertDialogBody>
        <AlertDialogFooter>
          <Button
            isLoading={loading}
            variant="ghost"
            onClick={handleConfirmRename}
            ml={3}
          >
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
  oidcUser,
  onClose,
  onConfirm,
}: {
  image: ImageInfo;
  file?: File;
  oidcUser: User;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<RequestError>();
  const ref = React.useRef<HTMLButtonElement>(null);
  const handleConfirm = async () => {
    if (file == null) return;
    try {
      setLoading(true);
      await imageAPI.replace(image.id, file, oidcUser.access_token);
      await imageAPI.purgeCache(image.id, oidcUser.access_token);
      onConfirm();
    } catch (err) {
      setErr(err);
    } finally {
      setLoading(false);
    }
  };
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
        {err && (
          <ErrorAlert
            title="Đổi hình ảnh không thành công"
            description={err.Err}
            onClose={() => setErr(undefined)}
          />
        )}
        <LoadingAlertDialogBody
          loading={loading}
          title="Đang thay đổi hình ảnh"
        >
          Bạn có chắc chắn muốn đổi hình ảnh chứ?
          {file && (
            <ReactCompareImage
              leftImage={imageAPI.getPreviewLink(image)}
              leftImageLabel="Hình cũ"
              rightImage={URL.createObjectURL(file)}
              rightImageLabel="Hình mới"
            />
          )}
        </LoadingAlertDialogBody>
        <AlertDialogFooter>
          <Button variant="ghost" onClick={handleConfirm} ml={3}>
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
  const handleConfirmRename = () => {
    props.onChange();
    setConfirmRename(false);
  };
  const handleNotConfirmRename = () => {
    setConfirmRename(false);
    setFolder(props.image.fullname);
  };
  const openConfirmRename = React.useCallback(() => {
    if (props.image.fullname !== folder) {
      setConfirmRename(true);
    }
  }, [props.image, folder]);
  const handleFilepathKeyPress = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        openConfirmRename();
      }
    },
    [openConfirmRename]
  );
  const handleReplaceFile = async () => {
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
    <>
      <RenameConfirm
        image={props.image}
        oidcUser={oidcUser}
        newPath={folder}
        open={confirmRename}
        onClose={handleNotConfirmRename}
        onConfirm={handleConfirmRename}
      />
      <Box display="none">
        <input
          ref={ref}
          type="file"
          multiple={false}
          onChange={handleFileInputChange}
          accept="image/png"
        />
      </Box>
      <Flex direction="column" w="100%" h="100%" overflow="hidden">
        <Flex direction="row">
          <Heading flexGrow={1} size="lg">
            Update
          </Heading>
          <HStack spacing={1}>
            <DeleteButton
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
            />
          </HStack>
        </Flex>
        <Box flex={1} overflowY="auto">
          <VStack pb={6} align="stretch" spacing={4}>
            <FormControl>
              <FormLabel>File path</FormLabel>
              <InputGroup>
                <InputLeftAddon>./</InputLeftAddon>
                <Input
                  roundedLeft={0}
                  type="text"
                  value={folder}
                  onChange={handleFolderChange}
                  onBlur={openConfirmRename}
                  onKeyPress={handleFilepathKeyPress}
                />
              </InputGroup>
            </FormControl>
            <Box cursor="pointer">
              <Box color="gray.500" pt={2}>
                <Icon mb={1} w={4} h={4} as={MdHelp} mr={1} />
                Click vào hình ảnh để đổi hình ảnh nhé
              </Box>
              <Box h={60}>
                <ReplaceCofirm
                  onClose={() => setReplacedFile(undefined)}
                  onConfirm={handleReplaceFile}
                  oidcUser={oidcUser}
                  file={replacedFile}
                  image={props.image}
                />
                <FileDrop onDrop={handleFileDrop}>
                  <Box
                    h={60}
                    border="1px"
                    borderRadius="md"
                    borderColor="gray.500"
                  >
                    <Image
                      key={imageKey}
                      height="100%"
                      width="100%"
                      objectFit="cover"
                      onClick={openFileSelect}
                      src={imageAPI.getPreviewLink(props.image)}
                      alt={imageAPI.getPreviewLink(props.image)}
                    />
                  </Box>
                </FileDrop>
              </Box>
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
          </VStack>
        </Box>
      </Flex>
    </>
  );
};
