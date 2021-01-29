import * as React from "react";
import { FileDrop } from "react-file-drop";
import { MdDelete, MdClose } from "react-icons/md";
import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  Icon,
  IconButton,
  Image,
  Spacer,
  Spinner,
  Tag,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { MdCheckCircle, MdError } from "react-icons/md";
import { AddIcon } from "@chakra-ui/icons";
import { RequestError } from "resources/api";
export interface IFilePreivew {
  data: string;
  name: string;
  file: File;
  state?: FileState;
  err?: RequestError;
}

export enum FileState {
  NOTSTARTED = "not-stared",
  UPLOADING = "uploading",
  SUCCESS = "success",
  FAIL = "error",
}

interface IFileInput {
  onChange?: (files: IFilePreivew[]) => void;
  multiple?: boolean;
  previewImages: IFilePreivew[];
}

export const FileInput = ({
  onChange,
  multiple,
  previewImages,
}: IFileInput) => {
  const [images, setImages] = React.useState<IFilePreivew[]>([]);
  const ref = React.useRef<HTMLInputElement>(null);
  const handleFileDrop = React.useCallback(
    (files: FileList | null) => {
      setImages([]);
      if (files == null) return;
      const fileListAsArray = Array.from(files);
      const imageNames = images.map((image) => image.name);
      const newImages = fileListAsArray
        .map((file) => {
          return {
            data: URL.createObjectURL(file),
            name: file.name,
            file: file,
            state: FileState.NOTSTARTED,
          };
        })
        .filter((image) => !imageNames.includes(image.name));
      onChange && onChange([...images, ...newImages]);
    },
    [images, onChange]
  );
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      handleFileDrop(files);
    },
    [handleFileDrop]
  );
  const handleClear = () => {
    if (ref.current == null) return;
    ref.current.value = "";
    setImages([]);
  };
  const removeImage = React.useCallback(
    (removedImage: IFilePreivew) => {
      onChange &&
        onChange(images.filter((image) => image.name !== removedImage.name));
    },
    [images, onChange]
  );
  React.useEffect(() => {
    setImages(previewImages);
    if (ref.current == null) return;
    if (previewImages.length === 0) ref.current.value = "";
  }, [previewImages]);
  return (
    <Flex direction="column" h="100%">
      <Flex direction="row">
        <FormLabel>Files</FormLabel>
        {images.length > 0 && (
          <Text fontSize="sm" color="gray.300">
            {images.length} hình
          </Text>
        )}
        <Spacer />
        {images && images.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<MdDelete />}
            onClick={handleClear}
          >
            Clear
          </Button>
        )}
      </Flex>
      <Box display="none">
        <input
          ref={ref}
          type="file"
          value={""}
          multiple={multiple}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
        />
      </Box>
      <Box h={0} flex={1} overflow="auto">
        <FileDrop onDrop={handleFileDrop}>
          <Flex direction="row" flexWrap="wrap" mt={2}>
            {images.map((image, index) => (
              <Box
                key={index}
                w={32}
                h={32}
                position="relative"
                rounded="sm"
                border="1px"
                mr={1}
                mb={1}
              >
                <Image
                  w="100%"
                  height="100%"
                  objectFit="cover"
                  src={image.data}
                  alt={image.name}
                />
                <Box position="absolute" bottom={1} left={1} right={1}>
                  <Box w="100%">
                    <Tag size="sm" fontSize={12} opacity={0.5}>
                      <Tooltip label={image.name} aria-label={image.name}>
                        <Text isTruncated>{image.name}</Text>
                      </Tooltip>
                    </Tag>
                  </Box>
                </Box>
                <Box position="absolute" top={1} left={1}>
                  <Box w="100%">
                    {image.state === FileState.UPLOADING && (
                      <Spinner color="blue.500" />
                    )}
                    {image.state === FileState.SUCCESS && (
                      <Icon as={MdCheckCircle} color="green.500" />
                    )}
                    {image.state === FileState.FAIL && (
                      <Tooltip
                        shouldWrapChildren
                        placement="top"
                        label={image.err ? image.err.Err : "Có lỗi xãy ra"}
                      >
                        <Icon as={MdError} color="red.500" name="warning-2" />
                      </Tooltip>
                    )}
                  </Box>
                </Box>
                <Box position="absolute" top={1} right={1}>
                  <IconButton
                    size="sm"
                    aria-label="close"
                    icon={<MdClose />}
                    onClick={() => removeImage(image)}
                  />
                </Box>
              </Box>
            ))}
            <Flex
              direction="column"
              alignItems="center"
              w={32}
              h={32}
              border="1px dashed"
              rounded="sm"
              cursor="pointer"
              onClick={() => ref.current?.click()}
            >
              <Center h="100%">
                <AddIcon color="gray.200" w={16} h={16} />
              </Center>
            </Flex>
          </Flex>
        </FileDrop>
      </Box>
    </Flex>
  );
};
