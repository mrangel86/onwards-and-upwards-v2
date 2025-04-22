
import React from "react";

type ImageCollageProps = {
  images: string[];
};

const ImageCollage: React.FC<ImageCollageProps> = ({ images }) => (
  <div className="flex flex-col md:flex-row gap-4 my-8">
    {images.map((img, i) => (
      <img
        key={i}
        src={img}
        className="flex-1 h-44 object-cover rounded-xl shadow-md"
        style={{ minWidth: 0 }}
        alt={`Collage image ${i + 1}`}
        loading="lazy"
      />
    ))}
  </div>
);

export default ImageCollage;
