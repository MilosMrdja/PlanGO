import React from "react";
import Button from "./UI/Button";
import Map from "./Map";

type Location = {
  latitude: number;
  longitude: number;
};

interface TripLocationViewProps {
  location: Location | null | undefined;
  canEdit: boolean;
  onEdit: () => void;
}

const TripLocationView: React.FC<TripLocationViewProps> = ({
  location,
  canEdit,
  onEdit,
}) => {
  return (
    <div>
      <h3 className="font-bold text-lg text-amber-700 pl-10 mb-2 flex items-center gap-2">
        Location
        {canEdit && (
          <Button
            type="button"
            variant="edit"
            className="ml-4"
            onClick={onEdit}
          >
            Change Location
          </Button>
        )}
      </h3>

      {!location && (
        <p className="text-gray-500 pl-10 italic mb-2">
          Location not selected yet.
        </p>
      )}

      {location && (
        <Map latitude={location.latitude} longitude={location.longitude} />
      )}
    </div>
  );
};

export default TripLocationView;
