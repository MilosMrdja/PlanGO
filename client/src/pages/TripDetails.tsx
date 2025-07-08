import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TripResponse } from "../types/TripResponse";
import { toast } from "react-toastify";
import { getById } from "../services/TripService";
import Button from "../components/UI/Button";
import ImageGallery from "../components/ImageGallery";
import Map from "../components/Map";
import H1 from "../components/UI/H1";
import { TripStatus } from "../types/enums/TripStatus";
import { CalendarDays } from "lucide-react";

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [statusColor, setStatusColor] = useState(
    "bg-yellow-200 text-yellow-800"
  );

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        if (!id) return;
        const data = await getById(id);
        console.log(data);
        setTrip(data[0]);
        if (data[0].status === TripStatus.InProgress)
          setStatusColor("bg-blue-200 text-blue-800");
        else if (data[0].status === TripStatus.Completed)
          setStatusColor("bg-green-200 text-green-800");
      } catch (error) {
        toast.error("Trip not found");
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  useEffect(() => {
    if (trip) {
    }
  }, [trip]);
  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      {/* Title and rating */}
      <div className="flex items-center justify-between">
        <H1>{trip.title}</H1>

        {/* Status and Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays className="w-4 h-4 text-amber-800" />
          <div>
            {trip.status === "Completed" && trip.startDate
              ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(
                  trip.endDate
                ).toLocaleDateString()}`
              : trip.status === "Planned" && trip.startDate
              ? `Start: ${new Date(trip.startDate).toLocaleDateString()}`
              : trip.status === "InProgress" && trip.startDate
              ? `Start: ${new Date(trip.startDate).toLocaleDateString()}`
              : "Unknown"}
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
        >
          {trip.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 pl-10 mb-2">{trip.description}</p>

      {/* Images */}
      {trip.images && trip.images.length > 0 && (
        <div>
          <h3 className="font-bold text-lg text-amber-700 pl-10 mb-2">
            Gallery
          </h3>
          <ImageGallery images={trip.images.map((e) => e.imageUrl)} />
        </div>
      )}

      {/* Location Map */}
      {trip.location && (
        <div>
          <h3 className="font-bold text-lg text-amber-700 pl-10 mb-2">
            Location
          </h3>
          <Map
            latitude={trip.location.latitude}
            longitude={trip.location.longitude}
          />
        </div>
      )}

      {/* Future Activities Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-amber-700 pl-10 mb-2">
          Activities
        </h3>
        {/* TODO: Render trip activities cards here */}
        <p className="text-sm text-gray-500 italic">Coming soon...</p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <Button
          type="button"
          variant="edit"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Cancel" : "Edit Trip"}
        </Button>
        <Button type="button" variant="danger">
          Delete Trip
        </Button>
      </div>

      {editMode && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          {/* TODO: Add editable form fields for trip update */}
          <p>Edit form goes here.</p>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
