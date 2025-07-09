import React from "react";
import Button from "./UI/Button";
import Map from "./Map";

type TripStatus = "Planned" | "InProgress" | "Completed" | "Canceled";

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationModalProps {
  show: boolean;
  onClose: () => void;
  selectedLocation: Location | null;
  tripLocation?: Location | null;
  onSelectLocation: (loc: Location) => void;
  onSave: () => void;
  status: TripStatus;
}

const LocationModal: React.FC<LocationModalProps> = ({
  show,
  onClose,
  selectedLocation,
  tripLocation,
  onSelectLocation,
  onSave,
  status,
}) => {
  if (!show) return null;

  const isEditable = status === "Planned" || status === "InProgress";

  const latitude =
    selectedLocation?.latitude ?? tripLocation?.latitude ?? 44.7866;
  const longitude =
    selectedLocation?.longitude ?? tripLocation?.longitude ?? 20.4489;

  const marker = selectedLocation ??
    tripLocation ?? { latitude: 44.7866, longitude: 20.4489 };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {isEditable ? "Select New Location" : "Location Preview"}
        </h2>
        <div className="mb-4">
          <Map
            latitude={latitude}
            longitude={longitude}
            onClick={
              isEditable
                ? (lat: number, lng: number) =>
                    onSelectLocation({ latitude: lat, longitude: lng })
                : undefined
            }
            marker={marker}
          />
        </div>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="cancel" onClick={onClose}>
            {isEditable ? "Cancel" : "Close"}
          </Button>
          {isEditable && (
            <Button
              type="button"
              variant="submit"
              onClick={onSave}
              disabled={!selectedLocation}
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
