import React from "react";
import {
  Image,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { MdFullscreen } from "react-icons/md";
interface Props {
  src: string;
}
export const ImageFullscreenButton = ({ src }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        size="sm"
        icon={<MdFullscreen />}
        aria-label="fullscreen"
        onClick={onOpen}
      />
      <Drawer onClose={onClose} isOpen={isOpen} size="full">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader></DrawerHeader> <DrawerCloseButton />
            <DrawerBody>
              <Image src={src} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};
