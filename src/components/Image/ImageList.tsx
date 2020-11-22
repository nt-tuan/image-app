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
  getNumberComparer,
  SortDirection,
  sortImages,
} from "./ImageSorter";
export interface ImageListItemProps {
  id: number;
  fullname: string;
  href: string;
  by?: string;
  at?: string;
  width?: number;
  height?: number;
  diskSize?: number;
  tags: string[];
}
interface Props {
  images?: ImageListItemProps[];
  total: number;
  onSelect: (image: ImageListItemProps) => void;
  sortByOptions?: SortOptionValue[];
  onTagSelect?: (tag: string) => void;
}
type SortOptionValue = "filename" | "at" | "width" | "height" | "diskSize";
const optionText = {
  filename: "Theo đường dẫn",
  at: "Theo ngày tạo",
  width: "Theo chiều rộng",
  height: "Theo chiều cao",
  diskSize: "Theo dung lượng lưu trữ",
};
const comparer = {
  filename: fullnameComparer,
  at: atComparer,
  width: getNumberComparer("width"),
  height: getNumberComparer("height"),
  diskSize: getNumberComparer("diskSize"),
};
export const SortBySelect = ({
  value,
  options,
  onChange,
}: {
  value: SortOptionValue;
  options: SortOptionValue[];
  onChange: (value: SortOptionValue) => void;
}) => (
  <Select
    icon={<MdSort />}
    value={value}
    variant="flushed"
    onChange={(event) => onChange(event.target.value as SortOptionValue)}
  >
    {options.map((op) => (
      <option key={op} value={op}>
        {optionText[op]}
      </option>
    ))}
  </Select>
);
export const ImageList = ({
  images,
  total,
  onSelect,
  sortByOptions,
  onTagSelect,
}: Props) => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(
    "asc"
  );
  const [sortBy, setSortBy] = React.useState<SortOptionValue>("filename");
  const translateImages = React.useMemo(() => {
    if (images == null) return undefined;
    return sortImages<ImageListItemProps>(
      images,
      sortDirection,
      comparer[sortBy]
    );
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
          <ImagesGridView
            images={translateImages}
            onSelect={onSelect}
            onTagSelect={onTagSelect}
          />
        )}
        {translateImages.length !== 0 && viewMode === "list" && (
          <ImageListView
            images={translateImages}
            onSelect={onSelect}
            onTagSelect={onTagSelect}
          />
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
            <SortBySelect
              options={
                sortByOptions ?? [
                  "filename",
                  "at",
                  "width",
                  "height",
                  "diskSize",
                ]
              }
              value={sortBy}
              onChange={setSortBy}
            />
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
