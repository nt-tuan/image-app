import * as React from "react";
import { ImageUploader } from "./ImageUploader";
import { imageAPI, RequestError, UnauthorizeError } from "resources/api";
import { ImageInfo } from "resources/models";
import { ImageSearch } from "./ImageSearch";
import { ImageList } from "./ImageList";
import { ImageEditor } from "./ImageEditor";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import { Box, Button, Flex, Heading, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Redirect } from "react-router-dom";
import { ImageDetail } from "./ImageDetail";
import { ImageTags } from "./ImageTags";
import { MdClearAll } from "react-icons/md";

export const ImageContext = React.createContext<{
  tags: Set<string>;
  selectedTags: Set<string>;
  setSelectedTags: React.Dispatch<React.SetStateAction<Set<string>>>;
  images?: ImageInfo[];
  filtered?: ImageInfo[];
  setFiltered?: React.Dispatch<React.SetStateAction<ImageInfo[] | undefined>>;
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
  const [filtered, setFiltered] = React.useState<ImageInfo[]>();
  const [tags, setTags] = React.useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(
    new Set()
  );
  const [unauthorized, setUnauthorized] = React.useState(false);
  React.useEffect(() => {
    imageAPI
      .get(oidcUser.access_token)
      .then((images) => {
        const tags = images.reduce((pre, cur) => {
          if (cur.tags != null) {
            return [...pre, ...cur.tags];
          }
          return pre;
        }, [] as string[]);
        var set = new Set(tags);
        setTags(set);
        setImages(images);
        setFiltered(images);
      })
      .catch((err: RequestError) => {
        if (err === UnauthorizeError) {
          setUnauthorized(false);
        }
      });
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
      setFiltered(
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
  const handleDeselectTag = (tag: string) => {
    setSelectedTags((tags) => {
      const newTags = new Set(tags);
      newTags.delete(tag);
      return newTags;
    });
  };
  const handleAddFilteredTags = React.useCallback(
    (tags: string[]) => {
      if (tags.length === 0) return;
      const newTags = new Set([...Array.from(selectedTags), ...tags]);
      setSelectedTags(newTags);
    },
    [selectedTags]
  );
  const handleSelectImage = (id: number) => {
    const found = images?.filter((image) => image.id === id);
    if (found == null || found.length === 0) return;
    setSelected({ ...found[0], mode: "view" });
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
        setFiltered,
        setSelected,
      }}
    >
      <Flex h="100%" w="100%" direction="row" justify="stretch">
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
              filteredTags={selectedTags}
              onAddFilteredTags={handleAddFilteredTags}
              images={images}
              onFiltered={setFiltered}
            />
          </Box>
          <Flex direction="row" alignItems="baseline" px={4}>
            <Box flex={1} overflowX="auto">
              <ImageTags
                onClose={handleDeselectTag}
                tags={Array.from(selectedTags)}
              />
            </Box>
            {selectedTags.size > 0 && (
              <IconButton
                color="red.500"
                icon={<MdClearAll />}
                aria-label="clear"
                onClick={() => setSelectedTags(new Set())}
              />
            )}
          </Flex>
          <Box w="100%" h={0} flex="1">
            <ImageList
              onTagSelect={(tag) => setSelectedTags(new Set([tag]))}
              images={filtered?.map((image) => ({
                ...image,
                href: imageAPI.getPreviewLink(image),
              }))}
              total={images?.length ?? 0}
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
            flexBasis={{ base: "100%", md: 450 }}
            flexShrink={0}
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
    </ImageContext.Provider>
  );
};
