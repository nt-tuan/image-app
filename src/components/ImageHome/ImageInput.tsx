import * as React from "react";
import { FileDrop } from "react-file-drop";
import { MdDelete, MdClose } from "react-icons/md";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Icon,
  IconButton,
  Image,
  Spinner,
  Tag,
} from "@chakra-ui/react";
export interface IFilePreivew {
  data: string;
  name: string;
  file: File;
  state?: FileState;
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
  const handleFileDrop = (files: FileList | null) => {
    setImages([]);
    if (files == null) return;
    const fileListAsArray = Array.from(files);
    const images = fileListAsArray.map((file) => {
      return {
        data: URL.createObjectURL(file),
        name: file.name,
        file: file,
        state: FileState.NOTSTARTED,
      };
    });
    onChange && onChange(images);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    handleFileDrop(files);
  };
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
        <Box flexGrow={1}>
          <FormLabel>Files</FormLabel>
        </Box>
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
          accept="image/png"
          className="hidden"
        />
      </Box>
      <Box flexGrow={1}>
        <FileDrop onDrop={handleFileDrop}>
          <Flex direction="row" flexWrap="wrap" mt={2}>
            {images.map((image) => (
              <Box
                key={image.name}
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
                <Box position="absolute" bottom={1} left={1}>
                  <Tag size="sm" fontSize={12} opacity={0.5}>
                    {image.name}
                  </Tag>
                </Box>
                <Box position="absolute" top={1} left={1}>
                  {image.state === FileState.UPLOADING && (
                    <Spinner color="blue.500" />
                  )}
                  {image.state === FileState.SUCCESS && (
                    <Icon color="green.300" name="check-circle" />
                  )}
                  {image.state === FileState.FAIL && (
                    <Icon color="yellow.500" name="warning-2" />
                  )}
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
              <Icon color="gray.200" w={16} h={16} name="add" margin="auto" />
            </Flex>
          </Flex>
        </FileDrop>
      </Box>
    </Flex>
  );
};
