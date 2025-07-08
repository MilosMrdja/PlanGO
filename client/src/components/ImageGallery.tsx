import React, { useEffect, useState } from "react";

interface ImageGalleryProps {
  images: string[];
  renderDelete?: (idx: number) => React.ReactNode;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  renderDelete,
}) => {
  const [current, setCurrent] = useState(0);
  const baseUrl = "https://localhost:7249/";
  useEffect(() => {
    if (current >= images.length) {
      setCurrent(images.length > 0 ? images.length - 1 : 0);
    }
  }, [images, current]);
  if (!images || images.length === 0) return null;

  const prevImage = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="w-full flex justify-center items-center">
        <button
          onClick={prevImage}
          className="absolute left-0 z-10 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 transition"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          &#8592;
        </button>
        <div className="relative w-full max-w-lg">
          <img
            src={`https://localhost:7249/${images[current]}`}
            alt={`Trip view ${current + 1}`}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
          {renderDelete && (
            <div className="absolute top-2 right-2">
              {renderDelete(current)}
            </div>
          )}
        </div>
        <button
          onClick={nextImage}
          className="absolute right-0 z-10 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 transition"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          &#8594;
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {current + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageGallery;
