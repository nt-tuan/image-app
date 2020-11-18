import React from "react";
import {
  Box,
  Center,
  Flex,
  HStack,
  IconButton,
  Select,
  Spinner,
  StackDivider,
} from "@chakra-ui/react";
import {
  MdViewList,
  MdViewModule,
  MdArrowUpward,
  MdArrowDownward,
  MdSort,
} from "react-icons/md";
import { ImagesGridView } from "./ImageGridView";
import { ImageListView } from "./ImageListView";
import {
  atComparer,
  fullnameComparer,
  SortDirection,
  sortImages,
} from "./ImageSorter";
export interface ImageListItemProps {
  id: number;
  fullname: string;
  href: string;
  by?: string;
  at?: string;
  tags: string[];
}
interface Props {
  images?: ImageListItemProps[];
  total: number;
  onSelect: (image: ImageListItemProps) => void;
}
type SortOptionValue = "filename" | "at";
export const SortBySelect = ({
  value,
  onChange,
}: {
  value: SortOptionValue;
  onChange: (value: SortOptionValue) => void;
}) => (
  <Select
    icon={<MdSort />}
    value={value}
    variant="flushed"
    onChange={(event) => onChange(event.target.value as SortOptionValue)}
  >
    <option value="filename">Theo đường dẫn</option>
    <option value="at">Theo ngày tạo</option>
  </Select>
);
export const ImageList = ({ images, total, onSelect }: Props) => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(
    "asc"
  );
  const [sortBy, setSortBy] = React.useState<SortOptionValue>("filename");
  const translateImages = React.useMemo(() => {
    if (images == null) return undefined;
    const comparer = sortBy === "at" ? atComparer : fullnameComparer;
    return sortImages<ImageListItemProps>(images, sortDirection, comparer);
  }, [images, sortBy, sortDirection]);
  if (translateImages == null) {
    return (
      <Flex w="100%" direction="column" alignItems="center">
        <Spinner color="blue.500" />
      </Flex>
    );
  }
  return (
    <Flex direction="column" h="100%">
      <Box flex={1} overflowY="auto">
        {translateImages.length === 0 && <Center>Không có hình ảnh nào</Center>}
        {translateImages.length !== 0 && viewMode === "grid" && (
          <ImagesGridView images={translateImages} onSelect={onSelect} />
        )}
        {translateImages.length !== 0 && viewMode === "list" && (
          <ImageListView images={translateImages} onSelect={onSelect} />
        )}
      </Box>
      <Flex color="gray" fontSize="sm" direction="row" alignItems="center">
        <Box flex={1}>
          Có {translateImages.length}/{total} hình ảnh được hiển thị
        </Box>
        <HStack>
          <HStack spacing={0}>
            <IconButton
              icon={
                sortDirection === "asc" ? (
                  <MdArrowUpward />
                ) : (
                  <MdArrowDownward />
                )
              }
              aria-label="sort direction"
              onClick={() =>
                setSortDirection((current) =>
                  current === "asc" ? "desc" : "asc"
                )
              }
            />
            <SortBySelect value={sortBy} onChange={setSortBy} />
          </HStack>
          <StackDivider borderColor="gray.200" />
          <HStack spacing={0}>
            <IconButton
              colorScheme={viewMode === "list" ? "blue" : "gray"}
              variant="ghost"
              icon={<MdViewList />}
              aria-label="list"
              onClick={() => setViewMode("list")}
            />
            <IconButton
              colorScheme={viewMode === "grid" ? "blue" : "gray"}
              variant="ghost"
              icon={<MdViewModule />}
              aria-label="grid"
              onClick={() => setViewMode("grid")}
            />
          </HStack>
        </HStack>
      </Flex>
    </Flex>
  );
};
