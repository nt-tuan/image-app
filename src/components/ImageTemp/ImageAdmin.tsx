import * as React from "react";
import { ImageUploader } from "./ImageUploader";
import { imageAPI, RequestError, UnauthorizeError } from "resources/api";
import { ImageInfo } from "resources/models";
import { ImageSearch, useDebouncedSearch } from "./ImageSearch";
import { ImageList } from "./ImageList";
import { ImageEditor } from "./ImageEditor";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import { Box, Button, Flex, Heading, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Redirect } from "react-router-dom";
import { ImageDetail } from "./ImageDetail";
import { ImageTags } from "../tag/ImageTags";
import { MdClearAll } from "react-icons/md";
import { normalizeName } from "resources/common/searching";
import { ImageListFooter, SortOptionValue } from "./ImageListFooter";
import { comparer, SortDirection, sortImages } from "./ImageSorter";

export const ImageContext = React.createContext<{
  tags: Set<string>;
  selectedTags: Set<string>;
  setSelectedTags: React.Dispatch<React.SetStateAction<Set<string>>>;
  images?: ImageInfo[];
  filtered?: ImageInfo[];
  setSelected: React.Dispatch<React.SetStateAction<EditableImage | undefined>>;
}>({
  tags: new Set(),
  selectedTags: new Set(),
  setSelectedTags: () => {},
  setSelected: () => {},
});

export interface EditableImage extends ImageInfo {
  mode: "view" | "edit";
}

export const ImageHome = () => {
  const { oidcUser } = useReactOidc();
  const [selected, setSelected] = React.useState<EditableImage>();
  const [images, setImages] = React.useState<ImageInfo[]>();
  const [sorting, setSorting] = React.useState<{
    sortBy: SortOptionValue;
    sortDirection: SortDirection;
  }>({ sortBy: "filename", sortDirection: "asc" });
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [tags, setTags] = React.useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(
    new Set()
  );
  const [unauthorized, setUnauthorized] = React.useState(false);
  const [err, setErr] = React.useState<RequestError>();
  const {
    inputText,
    setInputText,
    searchResult,
  } = useDebouncedSearch<ImageInfo>(images, selectedTags);
  const filtered = React.useMemo(() => {
    if (searchResult.result == null) return undefined;
    return sortImages<ImageInfo>(
      searchResult.result,
      sorting.sortDirection,
      comparer[sorting.sortBy]
    );
  }, [searchResult, sorting]);
  const loading = searchResult.loading;
  React.useEffect(() => {
    let subscription = true;
    imageAPI
      .get(oidcUser.access_token)
      .then((images) => {
        if (!subscription) {
          return;
        }
        const tags = images.reduce((pre, cur) => {
          if (cur.tags != null) {
            return [...pre, ...cur.tags];
          }
          return pre;
        }, [] as string[]);
        var set = new Set(tags.map((tag) => normalizeName(tag)));
        setTags(set);
        setImages(images);
      })
      .catch((err: RequestError) => {
        setErr(err);
        if (err === UnauthorizeError) {
          setUnauthorized(false);
          return;
        }
      });
    return () => {
      subscription = false;
    };
  }, [oidcUser]);
  const handleViewAdd = () => {
    setSelected({
      id: 0,
      fullname: "",
      tags: [],
      time: new Date(),
      mode: "view",
      link: "",
      height: 0,
      width: 0,
      diskSize: 0,
    } as EditableImage);
  };
  const handleCloseAdd = () => {
    setSelected(undefined);
  };
  const handleSelectedChange = () => {
    if (selected == null) return;
    imageAPI.getByID(selected.id, oidcUser.access_token).then((newImage) => {
      setImages(
        (images) =>
          images &&
          images.map((image) => {
            if (image.id === selected.id) {
              return newImage;
            }
            return image;
          })
      );
      setSelected({ ...newImage, mode: selected.mode });
      setTags((tags) => {
        const temp = tags;
        newImage.tags.forEach((tag) => temp.add(tag));
        return temp;
      });
    });
  };
  const handleAdded = (image: ImageInfo) => {
    const newImages = [...(images ?? []), image];
    setImages(newImages);
  };
  const handleDelete = () => {
    if (images == null || selected == null) return;
    const newImages = images?.filter((image) => image.id !== selected.id);
    setImages(newImages);
    setSelected(undefined);
  };
  const handleToggleTag = React.useCallback(
    (tag: string) => {
      const newTags = new Set(selectedTags);
      if (selectedTags.has(tag)) {
        newTags.delete(tag);
        setSelectedTags(newTags);
        return;
      }
      newTags.add(tag);
      setSelectedTags(newTags);
    },
    [selectedTags]
  );
  const handleSelectImage = (id: number) => {
    const found = images?.filter((image) => image.id === id);
    if (found == null || found.length === 0) return;
    setSelected({ ...found[0], mode: "view" });
  };
  const handleSortingChange = (value: {
    sortBy: SortOptionValue;
    sortDirection: SortDirection;
  }) => {
    setSorting(value);
  };

  if (unauthorized) return <Redirect to={"/401"} />;
  return (
    <ImageContext.Provider
      value={{
        tags,
        selectedTags,
        setSelectedTags,
        images,
        filtered,
        setSelected,
      }}
    >
      <Flex h="100%" w="100%" direction="column" justify="stretch">
        <Flex flex={1} h={0} w="100%" direction="row" justify="stretch">
          <Flex
            display={{ base: selected ? "none" : "flex", md: "flex" }}
            w={0}
            h="100%"
            direction="column"
            flex={1}
          >
            <Flex alignItems="end" direction="row" py={2} px={4}>
              <Heading flex={1} size="lg">
                Hình ảnh
              </Heading>
              <Button
                size="sm"
                colorScheme="blue"
                leftIcon={<AddIcon />}
                onClick={handleViewAdd}
              >
                Thêm
              </Button>
            </Flex>
            <Box w="100%" pb={2} shadow="sm" px={4}>
              <ImageSearch
                value={inputText}
                onChange={setInputText}
                loading={loading}
              />
            </Box>
            <Flex py={2} direction="row" alignItems="stretch" px={4}>
              <Box flex={1} overflowX="auto">
                <ImageTags
                  onClick={handleToggleTag}
                  // onClose={handleDeselectTag}
                  tags={tags}
                  selected={selectedTags}
                />
              </Box>
              {selectedTags.size > 0 && (
                <IconButton
                  variant="link"
                  color="red.500"
                  icon={<MdClearAll />}
                  aria-label="clear"
                  onClick={() => setSelectedTags(new Set())}
                />
              )}
            </Flex>
            <Box w="100%" h={0} flex="1">
              <ImageList
                err={err}
                onTagSelect={(tag) => setSelectedTags(new Set([tag]))}
                images={filtered?.map((image) => ({
                  ...image,
                  href: imageAPI.getPreviewLink(image),
                }))}
                viewMode={viewMode}
                onSelect={(image) => handleSelectImage(image.id)}
              />
            </Box>
          </Flex>
          {selected && (
            <Box
              h="100%"
              bgColor="white"
              px={4}
              pt={6}
              w="450px"
              flexBasis={{ base: "100%", md: "450px" }}
              flexShrink={0}
              flexGrow={0}
              boxShadow="lg"
            >
              {selected != null && selected.id === 0 && (
                <ImageUploader onAdded={handleAdded} onClose={handleCloseAdd} />
              )}
              {selected != null &&
                selected.id !== 0 &&
                selected.mode === "edit" && (
                  <ImageEditor
                    image={selected}
                    onChange={handleSelectedChange}
                    onClose={handleCloseAdd}
                    onDelete={handleDelete}
                  />
                )}
              {selected != null &&
                selected.id !== 0 &&
                selected.mode === "view" && (
                  <ImageDetail
                    image={selected}
                    onClose={handleCloseAdd}
                    onEdit={() =>
                      setSelected((selected) =>
                        selected ? { ...selected, mode: "edit" } : undefined
                      )
                    }
                  />
                )}
            </Box>
          )}
        </Flex>
        <ImageListFooter
          sortBy={sorting.sortBy}
          sortDirection={sorting.sortDirection}
          currentCount={filtered?.length ?? 0}
          total={images?.length ?? 0}
          onChange={handleSortingChange}
          onViewModeChange={setViewMode}
          viewMode={viewMode}
        />
      </Flex>
    </ImageContext.Provider>
  );
};
