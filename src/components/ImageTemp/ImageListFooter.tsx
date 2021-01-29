import React from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Select,
  StackDivider,
} from "@chakra-ui/react";
import {
  MdViewList,
  MdViewModule,
  MdArrowUpward,
  MdArrowDownward,
  MdSort,
} from "react-icons/md";
import { SortDirection } from "./ImageSorter";
import { RequestError } from "resources/api";

interface Props {
  err?: RequestError;
  total: number;
  sortBy: SortOptionValue;
  sortDirection: SortDirection;
  currentCount: number;
  sortByOptions?: SortOptionValue[];
  onChange: (value: {
    sortBy: SortOptionValue;
    sortDirection: SortDirection;
  }) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (value: "grid" | "list") => void;
}
export type SortOptionValue =
  | "filename"
  | "at"
  | "width"
  | "height"
  | "diskSize";
const optionText = {
  filename: "Theo đường dẫn",
  at: "Theo ngày tạo",
  width: "Theo chiều rộng",
  height: "Theo chiều cao",
  diskSize: "Theo dung lượng lưu trữ",
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
    bgColor="gray.700"
    onChange={(event) => onChange(event.target.value as SortOptionValue)}
  >
    {options.map((op) => (
      <option key={op} value={op}>
        {optionText[op]}
      </option>
    ))}
  </Select>
);
export const ImageListFooter = ({
  sortBy,
  sortDirection,
  total,
  currentCount,
  sortByOptions,
  onChange,
  viewMode,
  onViewModeChange,
}: Props) => {
  const handleDirectionChange = React.useCallback(() => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    onChange({ sortBy, sortDirection: newDirection });
  }, [sortBy, sortDirection, onChange]);
  const handleSortByChange = React.useCallback(
    (sortBy: SortOptionValue) => {
      onChange({ sortBy, sortDirection });
    },
    [sortDirection, onChange]
  );
  return (
    <Flex
      bgColor="gray.700"
      color="gray.100"
      px={4}
      fontSize="sm"
      direction="row"
      alignItems="center"
    >
      <Box flex={1} isTruncated>
        Có {currentCount}/{total} hình ảnh được hiển thị
      </Box>
      <HStack>
        <HStack spacing={0}>
          <IconButton
            _hover={{ color: "blue.500" }}
            variant="ghost"
            icon={
              sortDirection === "asc" ? <MdArrowUpward /> : <MdArrowDownward />
            }
            aria-label="sort direction"
            onClick={handleDirectionChange}
          />
          <SortBySelect
            options={
              sortByOptions ?? ["filename", "at", "width", "height", "diskSize"]
            }
            value={sortBy}
            onChange={handleSortByChange}
          />
        </HStack>
        <StackDivider borderColor="gray.200" />
        <HStack spacing={0}>
          <IconButton
            colorScheme={viewMode === "list" ? "blue" : "gray"}
            variant="ghost"
            icon={<MdViewList />}
            aria-label="list"
            onClick={() => onViewModeChange("list")}
          />
          <IconButton
            colorScheme={viewMode === "grid" ? "blue" : "gray"}
            variant="ghost"
            icon={<MdViewModule />}
            aria-label="grid"
            onClick={() => onViewModeChange("grid")}
          />
        </HStack>
      </HStack>
    </Flex>
  );
};
