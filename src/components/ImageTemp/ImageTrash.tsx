import React from "react";
import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import { ImageHistory } from "resources/models";
import { Redirect } from "react-router-dom";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import { imageAPI, RequestError, UnauthorizeError } from "resources/api";
import { ImageList } from "./ImageList";
import { ImageSearch, useDebouncedSearch } from "./ImageSearch";
import { DeletedImageDetail } from "./DeletedImageDetail";
import { LoadingConfirm } from "components/LoadingConfirm";
import { ImageListFooter, SortOptionValue } from "./ImageListFooter";
import { comparer, SortDirection, sortImages } from "./ImageSorter";
const emptySet = new Set<string>();
export const Trash = () => {
  const { oidcUser } = useReactOidc();
  const [selected, setSelected] = React.useState<ImageHistory>();
  const [images, setImages] = React.useState<ImageHistory[]>();
  const debounce = useDebouncedSearch(images, emptySet);
  const [sorting, setSorting] = React.useState<{
    sortBy: SortOptionValue;
    sortDirection: SortDirection;
  }>({ sortBy: "filename", sortDirection: "asc" });
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [unauthorized, setUnauthorized] = React.useState(false);
  const [confirmRestore, setConfirmRestore] = React.useState(false);
  const filtered = React.useMemo(() => {
    if (debounce.searchResult.result == null) return undefined;
    const filteredHistory = sortImages<ImageHistory>(
      debounce.searchResult.result,
      sorting.sortDirection,
      comparer[sorting.sortBy]
    );
    return filteredHistory.map((image) => ({
      ...image,
      tags: [],
      href: imageAPI.getDeletedImageURL(image.backupFullname),
    }));
  }, [debounce, sorting]);
  React.useEffect(() => {
    let subscription = true;
    imageAPI
      .getDeletedImages(oidcUser.access_token)
      .then((images) => {
        if (!subscription) return;
        setImages(images);
      })
      .catch((err: RequestError) => {
        if (err === UnauthorizeError) {
          setUnauthorized(false);
        }
      });
    return () => {
      subscription = false;
    };
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
    <Flex h="100%" direction="column" justify="stretch">
      <Flex h={0} flex={1} direction="row">
        <Flex
          height="100%"
          overflowY="hidden"
          display={{ base: selected ? "none" : "flex", md: "flex" }}
          direction="column"
          flexGrow={1}
          justify="stretch"
        >
          <Flex alignItems="baseline" direction="row" px={4} py={2}>
            <Flex flexGrow={1}>
              <Heading size="lg">Hình ảnh đã xóa</Heading>
            </Flex>
          </Flex>
          <Box px={4} pb={2} shadow="sm">
            <ImageSearch
              value={debounce.inputText}
              onChange={debounce.setInputText}
              loading={debounce.searchResult.loading}
            />
          </Box>
          <Box flex={1} overflow="hidden">
            <ImageList
              viewMode={viewMode}
              images={filtered}
              onSelect={(img) => handleSelect(img.id)}
            />
          </Box>
        </Flex>
        {selected && (
          <Box
            minHeight="100%"
            overflowY="auto"
            bgColor="white"
            px={4}
            py={6}
            w="450px"
            flexBasis={{ base: "100%", md: "450px" }}
            flexShrink={0}
            boxShadow="lg"
          >
            <LoadingConfirm
              isOpen={confirmRestore}
              onClose={() => setConfirmRestore(false)}
              header={`Bạn có muốn khôi phục lại hình ảnh ${selected.fullname}`}
              onConfirm={handleRestore}
            >
              <Image
                src={imageAPI.getDeletedImageURL(selected.backupFullname)}
              />
            </LoadingConfirm>
            <DeletedImageDetail
              onRestore={() => setConfirmRestore(true)}
              onClose={handleClose}
              image={selected}
            />
          </Box>
        )}
      </Flex>
      <ImageListFooter
        sortBy={sorting.sortBy}
        sortDirection={sorting.sortDirection}
        currentCount={filtered?.length ?? 0}
        total={images?.length ?? 0}
        onChange={setSorting}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
      />
    </Flex>
  );
};
