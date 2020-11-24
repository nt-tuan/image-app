import React from "react";
import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import { ImageHistory } from "resources/models";
import { Redirect } from "react-router-dom";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import { imageAPI, RequestError, UnauthorizeError } from "resources/api";
import { ImageList } from "./ImageList";
import { ImageSearch } from "./ImageSearch";
import { DeletedImageDetail } from "./DeletedImageDetail";
import { LoadingConfirm } from "components/LoadingConfirm";
export const Trash = () => {
  const { oidcUser } = useReactOidc();
  const [selected, setSelected] = React.useState<ImageHistory>();
  const [images, setImages] = React.useState<ImageHistory[]>();
  const [filtered, setFiltered] = React.useState<ImageHistory[]>();
  const [unauthorized, setUnauthorized] = React.useState(false);
  const [confirmRestore, setConfirmRestore] = React.useState(false);
  const imageListProps = React.useMemo(
    () =>
      filtered?.map((image) => ({
        ...image,
        tags: [],
        href: imageAPI.getDeletedImageURL(image.backupFullname),
      })),
    [filtered]
  );
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
  const handleRestore = async () => {
    if (selected == null) return;
    return imageAPI
      .restoreDeletedImage(selected.id, oidcUser.access_token)
      .then(() => {
        setSelected(undefined);
        setImages((images) =>
          images?.filter((image) => image.id !== selected.id)
        );
      });
  };
  const handleClose = () => setSelected(undefined);
  if (unauthorized) return <Redirect to={"/401"} />;
  return (
    <Flex h="100%" direction="row">
      <Flex
        height="100%"
        overflowY="hidden"
        display={{ base: selected ? "none" : "flex", md: "flex" }}
        direction="column"
        pt={6}
        flexGrow={1}
        justify="stretch"
      >
        <Flex alignItems="baseline" direction="row" px={4} py={2}>
          <Flex flexGrow={1}>
            <Heading size="lg">Hình ảnh đã xóa</Heading>
          </Flex>
        </Flex>
        <Box px={4} pb={2} shadow="sm">
          <ImageSearch images={images} onFiltered={setFiltered} />
        </Box>
        <Box flex={1} overflow="hidden">
          <ImageList
            sortByOptions={["filename", "at"]}
            images={imageListProps}
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
        >
          <LoadingConfirm
            isOpen={confirmRestore}
            onClose={() => setConfirmRestore(false)}
            header={`Bạn có muốn khôi phục lại hình ảnh ${selected.fullname}`}
            onConfirm={handleRestore}
          >
            <Image src={imageAPI.getDeletedImageURL(selected.backupFullname)} />
          </LoadingConfirm>
          <DeletedImageDetail
            onRestore={() => setConfirmRestore(true)}
            onClose={handleClose}
            image={selected}
          />
        </Box>
      )}
    </Flex>
  );
};
