import React from "react";

export const CancelButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button
      className="bg-red-300 text-sm hover:bg-red-500 text-gray-800 font-bold py-0 px-2 rounded inline-flex items-center"
      {...props}
    >
      <span className="text-white">{props.children}</span>
    </button>
  );
};
