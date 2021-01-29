import React from "react";
import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import { ImagesGridView } from "./ImageGridView";
import { ImageListView } from "./ImageListView";
import { RequestError } from "resources/api";
import { ErrorAlert } from "components/ErrorAlert";
export interface ImageListItemProps {
  id: number;
  fullname: string;
  href: string;
  by?: string;
  at?: string;
  width?: number;
  height?: number;
  diskSize?: number;
  tags: string[];
}
interface Props {
  err?: RequestError;
  images?: ImageListItemProps[];
  onSelect: (image: ImageListItemProps) => void;
  onTagSelect?: (tag: string) => void;
  viewMode: "list" | "grid";
}

export const ImageList = ({
  images,
  onSelect,
  viewMode,
  onTagSelect,
  err,
}: Props) => {
  if (err != null)
    return <ErrorAlert title="Đã có lỗi xãy ra" description={err.Err} />;
  if (images == null)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  return (
    <Flex direction="column" h="100%">
      <Box flex="1" overflowY="auto" px={4}>
        {images.length === 0 && <Center>Không có hình ảnh nào</Center>}
        {images.length !== 0 && viewMode === "grid" && (
          <ImagesGridView
            images={images}
            onSelect={onSelect}
            onTagSelect={onTagSelect}
          />
        )}
        {images.length !== 0 && viewMode === "list" && (
          <ImageListView
            images={images}
            onSelect={onSelect}
            onTagSelect={onTagSelect}
          />
        )}
      </Box>
    </Flex>
  );
};
