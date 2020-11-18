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
  filteredTags: Set<string>;
  onAddFilteredTags?: (tags: string[]) => void;
  images?: T[];
  onFiltered: (images: T[]) => void;
}
export const ImageSearch = <T extends SearchItem>({
  filteredTags,
  onAddFilteredTags,
  images,
  onFiltered,
}: ImageSearchProps<T>) => {
  const [contentQuery, setContentQuery] = React.useState<string>("");
  const { setInputText, setImages, setTags } = useSearchImage(onFiltered);
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      const tagExpress = query.match(searchByTagPattern);
      const tags =
        tagExpress && tagExpress.length > 0
          ? tagExpress[0]
              .replace(/[[]]*/, "")
              .split(",")
              .map((tag) => tag.trim().replace(normalizePattern, ""))
              .filter((tag) => tag !== "")
          : [];
      const contentQuery = query.replace(searchByTagPattern, "");
      onAddFilteredTags && tags.length > 0 && onAddFilteredTags(tags);
      setContentQuery(contentQuery);
    },
    [onAddFilteredTags]
  );
  const tags = React.useMemo(() => {
    return Array.from(filteredTags);
  }, [filteredTags]);

  React.useEffect(() => {
    setInputText(contentQuery);
  }, [contentQuery, setInputText]);
  React.useEffect(() => {
    setTags(tags);
  }, [tags, setTags]);
  React.useEffect(() => {
    setImages(images ?? []);
  }, [images, setImages]);
  return (
    <InputGroup>
      <InputLeftElement>
        <Icon as={MdSearch} />
      </InputLeftElement>
      <Input
        placeholder="Search..."
        value={contentQuery}
        onChange={handleInputChange}
      />
      <InputRightElement>
        <IconButton
          size="sm"
          h={8}
          aria-label="clear"
          icon={<MdClear />}
          onClick={() => setContentQuery("")}
        />
      </InputRightElement>
    </InputGroup>
  );
};

// Generic reusable hook
const useDebouncedSearch = <T extends SearchItem>(
  searchFunction: (searchPattern: string, images: T[], tags: string[]) => void
) => {
  // Handle the input text state
  const [inputText, setInputText] = React.useState("");
  const [images, setImages] = React.useState<T[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  // const [tags, setTags] = React.useState<string[]>([]);

  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  );

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  useAsync(async () => {
    return debouncedSearchFunction(inputText, images, tags);
  }, [debouncedSearchFunction, inputText, images, tags]);
  // Return everything needed for the hook consumer
  return {
    setInputText,
    setImages,
    setTags,
  };
};

const useSearchImage = <T extends SearchItem>(
  onFiltered: (images: T[]) => void
) => {
  return useDebouncedSearch<T>((searchPattern, images, tags) => {
    const normalizeSearchPattern = searchPattern.replace(normalizePattern, "");
    const filtered = images?.filter((image) => {
      const imageFullname = image.fullname.replace(normalizePattern, "");
      if (!imageFullname.match(normalizeSearchPattern)) return false;
      if (tags.length === 0) return true;
      if (image.tags == null) return true;
      return (
        image.tags.filter(
          (imageTag) => tags.filter((tag) => tag === imageTag).length > 0
        ).length >= tags.length
      );
    });
    onFiltered(filtered);
    return { searchPattern };
  });
};
