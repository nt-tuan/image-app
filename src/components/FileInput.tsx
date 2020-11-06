import * as React from "react";

export const FileInput = () => {
  const [images, setImages] = React.useState<string[]>([]);
  const ref = React.useRef<HTMLInputElement>(null);
  const onChange = () => {
    setImages([]);
    Object.values(ref.current?.files || {}).forEach((file) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onloadend = function (e) {
        setImages((oldImages) => [...oldImages, String(reader.result)]);
      };
    });
  };
  return (
    <div>
      <input
        ref={ref}
        className="form-input"
        type="file"
        multiple
        onChange={onChange}
        accept="image/*"
      />
      <div className="flex flex-row flex-wrap mt-2">
        {images.map((image) => (
          <img
            className="w-32 h-32 p-2 mb-2 mr-2 rounded-sm form-input"
            src={image}
            alt={image}
          />
        ))}
      </div>
    </div>
  );
};
