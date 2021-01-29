import React from "react";
import { Tag, TagCloseButton, HStack } from "@chakra-ui/react";
interface Props {
  tags: Set<string>;
  selected?: Set<string>;
  onClose?: (tag: string) => void;
  onClick?: (tag: string) => void;
}

export const ImageTags = ({ onClose, ...props }: Props) => {
  const handleClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    tag: string
  ) => {
    if (props.onClick == null) return;
    props.onClick(tag);
    e.stopPropagation();
  };
  const tags = React.useMemo(() => {
    return Array.from(props.tags).map((tag) => ({
      value: tag,
      isSelected: props.selected ? props.selected.has(tag) : true,
    }));
  }, [props]);
  return (
    <HStack wrap="wrap">
      {tags.map((tag) => (
        <Tag
          key={tag.value}
          cursor="pointer"
          variant={tag.isSelected ? "solid" : "outline"}
          colorScheme="blue"
          size="sm"
          mr="1"
          opacity={0.7}
          mb={1}
          onClick={(e) => handleClick(e, tag.value)}
        >
          {tag.value}
          {onClose && tag.isSelected && (
            <TagCloseButton onClick={() => onClose(tag.value)} />
          )}
        </Tag>
      ))}
    </HStack>
  );
};
