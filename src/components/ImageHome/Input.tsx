import React, { InputHTMLAttributes } from "react";

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      ref.current?.blur();
    }
    props.onKeyPress && props.onKeyPress(e);
  };
  return (
    <input
      {...props}
      ref={ref}
      onKeyPress={handleKeyPress}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
    ></input>
  );
};
