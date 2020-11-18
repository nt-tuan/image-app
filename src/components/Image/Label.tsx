import React from "react";

export const Label = ({ children }: { children: string }) => {
  return (
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {children}
    </label>
  );
};
