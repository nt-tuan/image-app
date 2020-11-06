import * as React from "react";
import classnames from "classnames";

interface Props {
  value: string;
  rows?: number;
  label?: string;
  placeholder?: string;
  className?: string;
  description?: string | React.ReactNode;
  onChange: (value: string) => void;
}

export function TextArea(props: Props) {
  return (
    <div className={classnames(props.className)}>
      <label className="block text-sm font-medium leading-5 text-gray-700">
        {props.label}
      </label>
      {props.description && (
        <div className="block text-xs text-gray-500">{props.description}</div>
      )}
      <div className="relative mt-1 rounded-md shadow-sm">
        <textarea
          id="price"
          rows={props.rows}
          className="block w-full font-mono text-xs text-justify form-textarea sm:text-xs sm:leading-5"
          placeholder={props.placeholder}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
