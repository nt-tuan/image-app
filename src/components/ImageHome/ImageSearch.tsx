import React from "react";
import useConstant from "use-constant";
import { useAsync } from "react-async-hook";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { ImageContext } from ".";
import { IImage } from "resources/image";
import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/core";
const searchByTagPattern = /^\[.*\]/g;
const normalizePattern = /[^a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/u;

export const ImageSearch = () => {
  const { pattern, setPattern } = useSearchImage();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPattern(e.target.value);
  };

  return (
    <div className="w-full relative mx-auto text-gray-600">
      <InputGroup>
        <InputLeftElement>
          <Icon name="search" />
        </InputLeftElement>
        <Input
          placeholder="Search..."
          value={pattern}
          onChange={handleInputChange}
        />
      </InputGroup>
    </div>
  );
};

// Generic reusable hook
const useDebouncedSearch = (
  searchFunction: (
    searchPattern: string,
    images: IImage[] | undefined,
    setFiltered?:
      | React.Dispatch<React.SetStateAction<IImage[] | undefined>>
      | undefined
  ) => void
) => {
  // Handle the input text state
  const [inputText, setInputText] = React.useState("");
  const { images, setFiltered } = React.useContext(ImageContext);

  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  );

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  useAsync(async () => {
    return debouncedSearchFunction(inputText, images, setFiltered);
  }, [debouncedSearchFunction, inputText, images, setFiltered]);

  // Return everything needed for the hook consumer
  return {
    pattern: inputText,
    setPattern: setInputText,
  };
};

const useSearchImage = () =>
  useDebouncedSearch(
    (
      searchPattern: string,
      images: IImage[] | undefined,
      setFiltered?:
        | React.Dispatch<React.SetStateAction<IImage[] | undefined>>
        | undefined
    ) => {
      const tagExpress = searchPattern.match(searchByTagPattern);
      var mustTags = [] as string[];
      if (tagExpress && tagExpress.length > 0) {
        mustTags = tagExpress[0]
          .replace(/[[]]*/, "")
          .split(",")
          .map((tag) => tag.trim().replace(normalizePattern, ""))
          .filter((tag) => tag !== "");
      }
      const normalizeSearchPattern = searchPattern
        .replace(searchByTagPattern, "")
        .replace(normalizePattern, "");
      const filtered = images?.filter((image) => {
        const imageFullname = image.fullname.replace(normalizePattern, "");

        if (!imageFullname.match(normalizeSearchPattern)) return false;
        if (mustTags.length === 0) return true;
        return (
          image.tags.filter(
            (imageTag) => mustTags.filter((tag) => tag === imageTag).length > 0
          ).length >= mustTags.length
        );
      });
      setFiltered && setFiltered(filtered);
      return { searchPattern, mustTags };
    }
  );
