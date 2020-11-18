import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { ImageHistory } from "resources/models";
import { Redirect } from "react-router-dom";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import { imageAPI, RequestError, UnauthorizeError } from "resources/api";
import { ImageList } from "./ImageList";
import { ImageSearch } from "./ImageSearch";
export const Trash = () => {
  const { oidcUser } = useReactOidc();
  const [selected, setSelected] = React.useState<ImageHistory>();
  const [images, setImages] = React.useState<ImageHistory[]>();
  const [filtered, setFiltered] = React.useState<ImageHistory[]>();
  const [unauthorized, setUnauthorized] = React.useState(false);
  React.useEffect(() => {
    imageAPI
      .getDeletedImages(oidcUser.access_token)
      .then(setImages)
      .catch((err: RequestError) => {
        if (err === UnauthorizeError) {
          setUnauthorized(false);
        }
      });
  }, [oidcUser]);
  const handleSelect = (id: number) => {
    const foundImages = images?.filter((image) => image.id === id);
    if (foundImages == null || foundImages.length === 0) return;
    setSelected(foundImages[0]);
  };
  if (unauthorized) return <Redirect to={"/401"} />;
  return (
    <Flex h="100%" direction="row">
      <Flex
        height="100%"
        overflowY="hidden"
        display={{ base: selected ? "none" : "flex", md: "flex" }}
        direction="column"
        px={4}
        pt={6}
        flexGrow={1}
      >
        <ImageSearch
          filteredTags={new Set()}
          images={images}
          onFiltered={setFiltered}
        />
        <Flex alignItems="baseline" direction="row">
          <Flex flexGrow={1}>
            <Heading size="lg">Danh sách hình ảnh đã xóa</Heading>
          </Flex>
        </Flex>
        <Box flex={1} overflow="hidden">
          <ImageList
            images={filtered?.map((image) => ({
              ...image,
              tags: [],
              href: imageAPI.getDeletedImageURL(image.backupFullname),
            }))}
            total={images?.length ?? 0}
            onSelect={(img) => handleSelect(img.id)}
          />
        </Box>
      </Flex>
      {selected && (
        <Box
          minHeight="100%"
          overflowY="scroll"
          bgColor="white"
          px={4}
          py={6}
          flexBasis={{ base: "100%", md: 450 }}
          flexShrink={0}
          boxShadow="lg"
        ></Box>
      )}
    </Flex>
  );
};
