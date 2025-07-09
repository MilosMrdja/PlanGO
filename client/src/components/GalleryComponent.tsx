import { Plus, Trash2 } from "lucide-react";
import React from "react";
import ImageGallery from "./ImageGallery";

type TripStatus = "Planned" | "InProgress" | "Completed" | "Canceled";

interface ImageItem {
  imageUrl: string;
}

interface TripGalleryProps {
  status: TripStatus;
  images: ImageItem[];
  onAddImages?: (files: FileList | null) => void;
  onDeleteImage?: (index: number) => void;
  imageLoading?: boolean;
}

const TripGallery: React.FC<TripGalleryProps> = ({
  status,
  images,
  onAddImages,
  onDeleteImage,
  imageLoading = false,
}) => {
  const isInProgress = status === "InProgress";
  const isReadOnly = status === "Completed" || status === "Canceled";
  const hasImages = images && images.length > 0;

  if (status === "Planned") return null;

  return (
    <div>
      <h3 className="font-bold text-lg text-amber-700 pl-10 mb-2 flex items-center gap-2">
        Gallery
        {isInProgress && onAddImages && (
          <label className="cursor-pointer bg-green-200 rounded-full text-green-600 hover:text-green-800 flex items-center">
            <Plus size={24} />
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => onAddImages(e.target.files)}
              disabled={imageLoading}
            />
          </label>
        )}
      </h3>

      {hasImages && (
        <div className="relative">
          <ImageGallery
            images={images.map((img) => img.imageUrl)}
            renderDelete={
              isInProgress && onDeleteImage
                ? (idx) => (
                    <button
                      className="bg-white bg-opacity-80 rounded-full p-1 text-red-600 hover:text-red-800 shadow"
                      onClick={() => onDeleteImage(idx)}
                      disabled={imageLoading}
                    >
                      <Trash2 size={20} />
                    </button>
                  )
                : undefined
            }
          />
        </div>
      )}
      {!hasImages && (
        <p className="text-sm text-gray-500 pl-10 italic">No images yet.</p>
      )}
    </div>
  );
};

export default TripGallery;
