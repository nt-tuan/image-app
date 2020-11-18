import React from "react";
import { VStack, StackDivider, Flex, Box, Image } from "@chakra-ui/react";
import LazyLoad from "react-lazyload";
import { ImageHistory } from "resources/models";
import { imageAPI } from "resources/api";
import { useReactOidc } from "@axa-fr/react-oidc-context";
export default function useVisibility<Element extends HTMLElement>(
  offset = 0
): [Boolean, React.RefObject<Element>] {
  const [isVisible, setIsVisible] = React.useState(false);
  const currentElement = React.createRef<Element>();

  const onScroll = () => {
    if (!currentElement.current) {
      setIsVisible(false);
      return;
    }
    const top = currentElement.current.getBoundingClientRect().top;
    setIsVisible(top + offset >= 0 && top - offset <= window.innerHeight);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  return [isVisible, currentElement];
}
export const HistoryImageView = ({
  image,
  onClick,
}: {
  image: ImageHistory;
  onClick: (image: ImageHistory) => void;
}) => {
  const { oidcUser } = useReactOidc();
  const [data, setData] = React.useState<string>("");
  React.useEffect(() => {
    console.log(image);
    if (image.backupFullname == null) return;
    imageAPI
      .getDeletedImageObjectURL(image.backupFullname, oidcUser.access_token)
      .then(setData);
  }, [image, oidcUser]);
  return <Image src={data} onClick={() => onClick(image)} />;
};
interface Props {
  images: ImageHistory[];
  onSelect: (image: ImageHistory) => void;
}

export const HistoryImageList = ({ images, onSelect }: Props) => {
  return (
    <Box h="100%" overflowY="auto">
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={0}
        align="stretch"
      >
        {images.map((image) => (
          <Flex
            key={image.id}
            h={12}
            direction="row"
            cursor="pointer"
            _hover={{ bgColor: "gray.200" }}
            onClick={() => onSelect(image)}
          >
            <LazyLoad height={48} overflow>
              <Box h={12} w={16} p={1}>
                <Box
                  w="100%"
                  h="100%"
                  border="1px"
                  borderRadius="md"
                  borderColor="gray.500"
                >
                  <HistoryImageView
                    image={image}
                    key={image.id.toString()}
                    onClick={() => onSelect(image)}
                  />
                </Box>
              </Box>
            </LazyLoad>
            <Flex direction="column" flex={1} pl={2}>
              <Flex flex={1} w="100%" direction="row" alignItems="baseline">
                <Box fontWeight="bold" fontSize="lg">
                  {image.fullname}
                </Box>
              </Flex>
              <Box fontSize="sm" color="gray.400">
                {/* {image.at} - {image.by} */}
                --
              </Box>
            </Flex>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};
