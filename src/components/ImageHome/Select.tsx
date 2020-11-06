import React from "react";
import { OptionsType, ValueType, ActionMeta } from "react-select";
import CreatableSelect from "react-select/creatable";

interface ITagItem {
  label: string;
  value: string;
}

interface ISelectTags {
  tags: string[];
  selected: string[];
  onRemoveTag: (tag: string) => void;
  onAddTag: (tag: string) => void;
}

export const SelectTags = (props: ISelectTags) => {
  const [selected, setSelected] = React.useState<OptionsType<ITagItem>>();
  const [options, setOptions] = React.useState<OptionsType<ITagItem>>([]);
  const handleChange = (
    newValue: ValueType<ITagItem>,
    meta: ActionMeta<ITagItem>
  ) => {
    var optValues = newValue as OptionsType<ITagItem>;
    if (meta.action === "create-option" || meta.action === "select-option") {
      var newTags = optValues.filter(
        (u) =>
          selected == null ||
          selected.filter((s) => s.value === u.value).length === 0
      );
      if (newTags.length > 0) {
        props.onAddTag(newTags[0].value);
      }
    }

    if (meta.action === "deselect-option" || meta.action === "remove-value") {
      if (selected == null) return;
      var deletedTags = selected.filter(
        (u) =>
          optValues == null ||
          optValues.filter((v) => v.value === u.value).length === 0
      );
      if (deletedTags.length > 0) {
        props.onRemoveTag(deletedTags[0].value);
      }
    }
  };
  React.useEffect(() => {
    setOptions(props.tags.map((tag) => ({ label: tag, value: tag })));
    setSelected(props.selected.map((tag) => ({ label: tag, value: tag })));
  }, [props]);
  return (
    <CreatableSelect
      value={selected}
      isMulti
      name="colors"
      options={options}
      onChange={handleChange}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
};
