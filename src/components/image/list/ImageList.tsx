import React from "react";
import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import { ImagesGridView } from "components/image/list/ImageGridView";
import { ImageListView } from "components/image/list/ImageListView";
import { RequestError } from "resources/api";
import { ErrorAlert } from "components/ErrorAlert";
import { ImageListItemProps } from "components/image/list/ItemProps";

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
