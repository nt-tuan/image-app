import * as React from "react";
import cx from "classnames";

export enum ButtonType {
  PRIMARY,
  SECONDARY,
  OUTLINED,
  MINIMAL,
}

interface Props {
  className?: string;
  onClick?: () => void;
  title?: string;
  type: ButtonType;
  disabled?: boolean;
  icon?: string;
  large?: boolean;
}

export const Button: React.FC<Props> = (props) => {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={cx(
        "h-10 px-4 py-1 text-base font-sans font-medium tracking-normal rounded-sm transition-all inline-flex items-center justify-center",
        props.type === ButtonType.PRIMARY &&
          "text-base text-gray-900 disabled:text-gray-400 bg-blue-400 hover:bg-blue-300 active:bg-blue-5000 disabled:bg-gray-100 border border-blue-500 disabled:border-gray-300 ",
        props.type === ButtonType.SECONDARY &&
          "text-gray-900 disabled:text-gray-400  bg-gray-100 hover:bg-gray-0 active:bg-gray-200 disabled:bg-gray-100  border border-gray-400 disabled:border-gray-300",
        props.type === ButtonType.OUTLINED &&
          "text-gray-800 disabled:text-gray-400 bg-gray-000 hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-0 border border-gray-400",
        props.type === ButtonType.MINIMAL &&
          "h-10 text-gray-800 disabled:bg-transparent hover:bg-gray-300 active:bg-gray-400  disabled:text-gray-400",
        props.className
      )}
    >
      <span>{props.title}</span>
    </button>
  );
};
