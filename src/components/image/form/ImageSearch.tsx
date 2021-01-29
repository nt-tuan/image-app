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
import {
  extractSearchQuery,
  normalizeName,
  normalizePath,
} from "resources/common/searching";

export interface Props {
  value: string;
  onChange: (text: string) => void;
  loading?: boolean;
}
export const ImageSearch = ({ value, onChange, loading }: Props) => {
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );
  return (
    <InputGroup>
      <InputLeftElement>
        <Icon as={MdSearch} />
      </InputLeftElement>
      <Input
        placeholder="Search..."
        bgColor="white"
        value={value}
        onChange={handleInputChange}
      />
      <InputRightElement>
        {loading === true && (
          <span>
            <Spinner size="sm" color="blue.500" />
          </span>
        )}
        {loading !== true && value != null && value.length > 0 && (
          <IconButton
            size="sm"
            h={8}
            aria-label="clear"
            icon={<MdClear />}
            onClick={() => onChange("")}
          />
        )}
      </InputRightElement>
    </InputGroup>
  );
};

interface SearchItem {
  fullname: string;
  tags?: string[];
}

const hasTags = (item: SearchItem, tags: Set<string>) => {
  const size = tags.size;
  if (size === 0) return true;
  if (item.tags == null) return false;
  return item.tags.filter((tag) => tags.has(normalizeName(tag))).length >= size;
};

const searchFunction = <T extends SearchItem>(
  text: string,
  images: T[] | undefined,
  selectedTags: Set<string>
) => {
  if (images == null) return images;
  const conditions = extractSearchQuery(text);
  const filteredTags = new Set([
    ...Array.from(selectedTags),
    ...conditions.tags,
  ]);
  const filtered = images.filter((image) => {
    if (!hasTags(image, filteredTags)) return false;
    if (conditions.regexp == null) return true;
    const normalizedFullname = normalizePath(image.fullname);
    const match = normalizedFullname.match(conditions.regexp);
    return match != null;
  });
  return filtered;
};

// Generic reusable hook
export const useDebouncedSearch = <T extends SearchItem>(
  images: T[] | undefined,
  selectedTags: Set<string>
) => {
  // Handle the input text state
  const [inputText, setInputText] = React.useState<string>("");
  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(
      (text: string, images: T[] | undefined, selectedTags: Set<string>) =>
        searchFunction(text, images, selectedTags),
      1000
    )
  );

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  const searchResult = useAsync(async () => {
    return debouncedSearchFunction(inputText, images, selectedTags);
  }, [debouncedSearchFunction, inputText, images, selectedTags]);

  // Return everything needed for the hook consumer
  return {
    inputText,
    setInputText,
    searchResult,
  };
};
