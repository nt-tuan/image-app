import React from "react";
import { Tag, TagCloseButton, HStack } from "@chakra-ui/react";
interface Props {
  tags: string[];
  onClose?: (tag: string) => void;
  onClick?: (tag: string) => void;
}

export const ImageTags = ({ tags, onClose, onClick }: Props) => {
  const handleClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    tag: string
  ) => {
    onClick && onClick(tag);
    e.stopPropagation();
  };

  return (
    <HStack wrap="wrap">
      {tags.map((tag) => (
        <Tag
          cursor="pointer"
          colorScheme="blue"
          size="sm"
          mr="1"
          opacity={0.7}
          mb={1}
          onClick={(e) => handleClick(e, tag)}
        >
          {tag}
          {onClose && <TagCloseButton onClick={() => onClose(tag)} />}
        </Tag>
      ))}
    </HStack>
  );
};
