import * as React from "react";
import cx from "classnames";

interface Props {
  className?: string;
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
  icon?: string;
  large?: boolean;
  checked: boolean;
}

export const ToggleButton: React.FC<Props> = (props) => {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={cx(
        "transition-all items-center justify-center text-xs form-input",
        "text-gray-800 disabled:bg-transparent disabled:text-gray-400 opacity-50",
        props.checked && "opacity-100",
        props.className
      )}
    >
      <span>{props.title}</span>
      {props.children}
    </button>
  );
};
