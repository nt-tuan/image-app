import React from "react";
import useConstant from "use-constant";
import { useAsync } from "react-async-hook";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { MdSearch, MdClear } from "react-icons/md";
const searchByTagPattern = /^\[.*\]/g;
const normalizePattern = /[^a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/u;
interface SearchItem {
  fullname: string;
  tags?: string[];
}
export interface ImageSearchProps<T extends SearchItem> {
  filteredTags?: Set<string>;
  onAddFilteredTags?: (tags: string[]) => void;
  images?: T[];
  onFiltered: (images: T[] | undefined) => void;
}
export const ImageSearch = <T extends SearchItem>({
  filteredTags,
  onAddFilteredTags,
  images,
  onFiltered,
}: ImageSearchProps<T>) => {
  const [contentQuery, setContentQuery] = React.useState<string>("");
  const tags = React.useMemo(() => {
    if (filteredTags == null) return [];
    return Array.from(filteredTags);
  }, [filteredTags]);
  const { inputText, setInputText, searchResult } = useSearchImage(
    images,
    tags
  );
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(e.target.value);
    },
    [setInputText]
  );
  React.useEffect(() => {
    if (searchResult == null) return;
    if (searchResult.loading) {
      onFiltered(undefined);
      return;
    }
    if (searchResult.result == null) return;
    if (searchResult.result.newTags.length > 0) {
      setInputText(searchResult.result.searchPattern);
      onAddFilteredTags && onAddFilteredTags(searchResult.result.newTags);
    }
    searchResult.result.filteredItems &&
      onFiltered(searchResult.result.filteredItems);
  }, [searchResult, onFiltered, onAddFilteredTags, setInputText]);
  return (
    <InputGroup>
      <InputLeftElement>
        <Icon as={MdSearch} />
      </InputLeftElement>
      <Input
        placeholder="Search..."
        bgColor="white"
        value={inputText}
        onChange={handleInputChange}
      />
      <InputRightElement>
        {searchResult.loading && (
          <span>
            <Spinner size="sm" color="blue.500" />
          </span>
        )}
        {!searchResult.loading && contentQuery.length > 0 && (
          <IconButton
            size="sm"
            h={8}
            aria-label="clear"
            icon={<MdClear />}
            onClick={() => setContentQuery("")}
          />
        )}
      </InputRightElement>
    </InputGroup>
  );
};

// Generic reusable hook
const useDebouncedSearch = <T extends SearchItem>(
  images: T[] | undefined,
  tags: string[],
  searchFunction: (
    searchPattern: string,
    images: T[] | undefined,
    tags: string[]
  ) => DebouceSearchResult<T>
) => {
  // Handle the input text state
  const [inputText, setInputText] = React.useState("");
  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  );

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  const searchResult = useAsync(async () => {
    const tagExpress = inputText.match(searchByTagPattern);
    const newTags =
      tagExpress && tagExpress.length > 0
        ? tagExpress[0]
            .replace(/[[]]*/, "")
            .split(",")
            .map((tag) => tag.trim().replace(normalizePattern, ""))
            .filter((tag) => tag !== "")
        : [];
    const searchPattern = inputText.replace(searchByTagPattern, "");
    if (searchPattern !== inputText || newTags.length > 0) {
      return {
        searchPattern,
        newTags,
        filteredItems: undefined,
      } as DebouceSearchResult<T>;
    }
    return debouncedSearchFunction(inputText, images, tags);
  }, [debouncedSearchFunction, inputText, images, tags]);

  // Return everything needed for the hook consumer
  return {
    inputText,
    setInputText,
    searchResult,
  };
};
interface DebouceSearchResult<T extends SearchItem> {
  filteredItems: T[] | undefined;
  newTags: string[];
  searchPattern: string;
}
const useSearchImage = <T extends SearchItem>(
  images: T[] | undefined,
  tags: string[]
) => {
  const search = (
    inputText: string,
    images: T[] | undefined,
    tags: string[]
  ) => {
    const tagExpress = inputText.match(searchByTagPattern);
    const newTags =
      tagExpress && tagExpress.length > 0
        ? tagExpress[0]
            .replace(/[[]]*/, "")
            .split(",")
            .map((tag) => tag.trim().replace(normalizePattern, ""))
            .filter((tag) => tag !== "")
        : [];
    const searchPattern = inputText.replace(searchByTagPattern, "");
    if (searchPattern !== inputText || newTags.length > 0) {
      return {
        searchPattern,
        newTags,
        filteredItems: undefined,
      } as DebouceSearchResult<T>;
    }
    try {
      const normalizeSearchPattern = new RegExp(searchPattern, "i");

      const filteredItems = images?.filter((image) => {
        const imageFullname = image.fullname;
        if (searchPattern.length > 1) {
          try {
            if (!imageFullname.match(normalizeSearchPattern)) return false;
          } catch {
            return false;
          }
        }
        if (tags.length === 0) return true;
        if (image.tags == null) return false;
        return (
          image.tags.filter((imageTag) => tags.includes(imageTag)).length >=
          tags.length
        );
      });
      return {
        searchPattern,
        newTags,
        filteredItems,
      } as DebouceSearchResult<T>;
    } catch {
      return {
        searchPattern,
        newTags,
        filteredItems: [],
      } as DebouceSearchResult<T>;
    }
  };
  return useDebouncedSearch<T>(images, tags, search);
};
