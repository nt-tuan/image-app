import React, { useCallback } from "react";
import {
  FileInput,
  FileState,
  IFilePreivew,
} from "components/ImageTemp/ImageInput";
import { ImageInfo } from "resources/models";
import { imageAPI, RequestError } from "resources/api";
import { MdClose, MdCheck } from "react-icons/md";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Spacer,
} from "@chakra-ui/react";
import { useReactOidc } from "@axa-fr/react-oidc-context";
interface IImageUploader {
  onClose: () => void;
  onAdded: (image: ImageInfo) => void;
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const setFileDataState = (
  state: FileState,
  current: IFilePreivew,
  err?: RequestError
) => {
  return (files: IFilePreivew[]) =>
    files.map((file) => {
      if (file.name === current.name) {
        return { ...file, err, state };
      }
      return file;
    });
};

export const ImageUploader = (props: IImageUploader) => {
  const [folder, setFolder] = React.useState<string>("");
  const [fileDatas, setFileDatas] = React.useState<IFilePreivew[]>([]);
  const { oidcUser } = useReactOidc();
  const handleImagesChange = (fileDatas: IFilePreivew[]) => {
    setFileDatas(fileDatas);
  };
  const handleSave = useCallback(() => {
    const executor = async () => {
      if (fileDatas === undefined) {
        return;
      }
      for (var i = 0; i < fileDatas.length; i++) {
        const fileData = fileDatas[i];
        if (fileData.state === FileState.SUCCESS) continue;
        const normalizeFolder = folder.trim();
        try {
          setFileDatas(setFileDataState(FileState.UPLOADING, fileData));
          var newImage = await imageAPI.upload(
            normalizeFolder + fileData.name,
            fileData.file,
            oidcUser.access_token
          );
          props.onAdded(newImage);
          await sleep(4000);
          setFileDatas(setFileDataState(FileState.SUCCESS, fileData));
        } catch (err) {
          setFileDatas(setFileDataState(FileState.FAIL, fileData, err));
        }
      }
    };
    executor();
  }, [fileDatas, folder, props, oidcUser]);
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolder(e.target.value);
  };
  return (
    <Flex direction="column" h="100%">
      <Flex direction="row" alignItems="baseline">
        <Box pb={10}>
          <Heading size="lg">Upload</Heading>
        </Box>
        <Spacer />
        <IconButton
          icon={<MdClose />}
          aria-label="Close"
          variant="ghost"
          onClick={props.onClose}
        ></IconButton>
      </Flex>

      <FormControl pb={10}>
        <FormLabel>Folder</FormLabel>
        <Input type="text" onChange={handleFolderChange} />
      </FormControl>
      <Box h={0} flexGrow={1} overflowY="hidden" pb={10}>
        <FileInput
          multiple
          onChange={handleImagesChange}
          previewImages={fileDatas}
        />
      </Box>

      <Button leftIcon={<MdCheck />} onClick={handleSave}>
        Lưu
      </Button>
    </Flex>
  );
};
