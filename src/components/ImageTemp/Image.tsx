import React from "react";

export const Image = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <object data={props.src} type="image">
    <img {...props} src="/no-image.jpg" alt={props.alt} />
  </object>
);
