import * as React from "react";
import classnames from "classnames";

interface Props {
  value: string;
  label?: string;
  placeholder?: string;
  className?: string;
  description?: string | React.ReactNode;
  onChange: (value: string) => void;
}

export function TextInput(props: Props) {
  return (
    <div className={classnames(props.className)}>
      <label className="block text-sm font-medium leading-5 text-gray-700">
        {props.label}
      </label>
      {props.description && (
        <div className="block text-xs text-gray-500">{props.description}</div>
      )}
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          id="price"
          className="block w-full font-mono text-xs form-input"
          placeholder={props.placeholder}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
