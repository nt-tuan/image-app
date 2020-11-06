import * as React from "react";
import { ImageUploader } from "./ImageUploader";
import { IImage, imageAPI } from "resources/image";
import { ImageSearch } from "./ImageSearch";
import { ImageList } from "./ImageList";
import { ImageEditor } from "./ImageEditor";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import { Box, Button, Flex, Heading } from "@chakra-ui/core";

export const ImageContext = React.createContext<{
  tags: Set<string>;
  images?: IImage[];
  filtered?: IImage[];
  setFiltered?: React.Dispatch<React.SetStateAction<IImage[] | undefined>>;
  setSelected?: React.Dispatch<React.SetStateAction<IImage | undefined>>;
}>({
  tags: new Set(),
});

const sortImages = (images: IImage[]) => {
  const sortedImages = images.sort((a, b) => {
    if (a.fullname < b.fullname) return -1;
    if (a.fullname === b.fullname) return 0;
    return 1;
  });
  return sortedImages;
};

export const ImageHome = () => {
  const { oidcUser } = useReactOidc();
  const [selected, setSelected] = React.useState<IImage>();
  const [images, setImages] = React.useState<IImage[]>();
  const [filtered, setFiltered] = React.useState<IImage[]>();
  const [tags, setTags] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    imageAPI.get(oidcUser.id_token).then((images) => {
      const tags = images.reduce((pre, cur) => {
        if (cur.tags != null) {
          return [...pre, ...cur.tags];
        }
        return pre;
      }, [] as string[]);
      var set = new Set(tags);
      setTags(set);
      const sortedImages = sortImages(images);
      setImages(images);
      setFiltered(sortedImages);
    });
  }, [oidcUser]);
  const handleViewAdd = () => {
    setSelected({ id: 0, fullname: "", tags: [], time: new Date() } as IImage);
  };
  const handleCloseAdd = () => {
    setSelected(undefined);
  };
  const handleSelectedChange = () => {
    if (selected == null) return;
    imageAPI.getByID(selected.id, oidcUser.id_token).then((newImage) => {
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
      setSelected(newImage);
      setTags((tags) => {
        const temp = tags;
        newImage.tags.forEach((tag) => temp.add(tag));
        return temp;
      });
    });
  };
  const handleAdded = (image: IImage) => {
    const newImages = [...(images ?? []), image];
    setImages(sortImages(newImages));
  };
  const handleDelete = () => {
    if (images == null || selected == null) return;
    const newImages = images?.filter((image) => image.id !== selected.id);
    setImages(newImages);
    setSelected(undefined);
  };
  return (
    <ImageContext.Provider
      value={{ tags, images, filtered, setFiltered, setSelected }}
    >
      <Flex flexGrow={1} h="100vh">
        <Flex
          height="100%"
          overflowY="scroll"
          display={{ base: selected ? "none" : "flex", md: "flex" }}
          direction="column"
          px={4}
          py={6}
          flexGrow={1}
        >
          <ImageSearch />
          <Flex alignItems="baseline" direction="row">
            <Flex flexGrow={1}>
              <Heading size="lg">Danh sách hình ảnh</Heading>
            </Flex>
            <Button leftIcon="add" variant="ghost" onClick={handleViewAdd}>
              Thêm
            </Button>
          </Flex>
          <ImageList />
        </Flex>
        {selected && (
          <Box
            h="100%"
            overflowY="scroll"
            px={4}
            py={6}
            flexBasis={{ base: "100%", md: 450 }}
            flexShrink={0}
            boxShadow="sm"
          >
            {selected != null && selected.id === 0 && (
              <ImageUploader onAdded={handleAdded} onClose={handleCloseAdd} />
            )}
            {selected != null && selected.id !== 0 && (
              <ImageEditor
                {...selected}
                onChange={handleSelectedChange}
                onClose={handleCloseAdd}
                onDelete={handleDelete}
              />
            )}
          </Box>
        )}
      </Flex>
    </ImageContext.Provider>
  );
};
