import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TripResponse } from "../types/TripResponse";
import { toast } from "react-toastify";
import { getById, updateTrip } from "../services/TripService";
import Button from "../components/UI/Button";
import ImageGallery from "../components/ImageGallery";
import Map from "../components/Map";
import H1 from "../components/UI/H1";
import { TripStatus } from "../types/enums/TripStatus";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import TextInput from "../components/UI/TextInput";

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusColor, setStatusColor] = useState(
    "bg-yellow-200 text-yellow-800"
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
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
      setEditTitle(trip.title);
      setEditDescription(trip.description);
    }
  }, [trip]);

  const handleAddImages = async (files: FileList | null) => {
    if (!files || !trip) return;
    setImageLoading(true);
    try {
      await updateTrip(trip.id, {
        images: Array.from(files),
        title: trip.title,
      });
      const data = await getById(trip.id);
      setTrip(data[0]);
      toast.success("Successfully added an image");
    } catch (err) {
      toast.error("You did not add an image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = async (idx: number) => {
    if (!trip) return;
    setImageLoading(true);
    try {
      const imageUrl = trip.images[idx].imageUrl;
      await updateTrip(trip.id, {
        imagesToDelete: [imageUrl],
        title: trip.title,
      });
      const data = await getById(trip.id);
      setTrip(data[0]);
      toast.success("Successfully deleted an image");
    } catch (err) {
      toast.error("You did not delet an image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleEditTrip = async () => {
    if (!trip) return;
    setLoading(true);
    try {
      await updateTrip(trip.id, {
        title: editTitle,
        description: editDescription,
      });
      const data = await getById(trip.id);
      setTrip(data[0]);
      toast.success("Successfully updated a trip");
      setShowEditModal(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!trip || !selectedLocation) return;
    setLoading(true);
    try {
      await updateTrip(trip.id, {
        location: {
          Latitude: selectedLocation.latitude,
          Longitude: selectedLocation.longitude,
        },
        title: trip.title,
      });
      const data = await getById(trip.id);
      setTrip(data[0]);
      toast.success("Location updated successfully");
      setShowLocationModal(false);
    } catch (err) {
      toast.error("Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      {/* Title and rating */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Leva strana: Naslov + Start dugme */}
        <div className="flex items-center gap-4">
          <H1>{trip.title}</H1>
          {(trip.status === "Planned" || trip.status === "InProgress") && (
            <Button
              type="button"
              variant="submit"
              className="text-sm px-3 py-1"
              onClick={() => {
                /* TODO: handle start trip */
              }}
            >
              Start Trip
            </Button>
          )}
        </div>

        {/* Sredina: Datum + Status badge */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-amber-800" />
            <span>
              {trip.status === "Completed" && trip.startDate
                ? `${new Date(
                    trip.startDate
                  ).toLocaleDateString()} - ${new Date(
                    trip.endDate
                  ).toLocaleDateString()}`
                : trip.startDate
                ? `Start: ${new Date(trip.startDate).toLocaleDateString()}`
                : "Unknown"}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
          >
            {trip.status}
          </span>
        </div>

        {/* Desna strana: Edit dugme u obliku ikonice */}
        <div className="ml-auto">
          {(trip.status === "Planned" || trip.status === "InProgress") && (
            <button
              onClick={() => setShowEditModal(true)}
              className="text-gray-500 hover:text-gray-700"
              title="Edit Trip"
            >
              ✏️
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 pl-10 mb-2">{trip.description}</p>

      {/* Images */}
      {trip.images && trip.images.length > 0 && (
        <div>
          <h3 className="font-bold text-lg text-amber-700 pl-10 mb-2 flex items-center gap-2">
            Gallery
            {trip.status === "InProgress" && (
              <label className="cursor-pointer bg-green-200  rounded-full text-green-600 hover:text-green-800 flex items-center">
                <Plus size={24} />
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleAddImages(e.target.files)}
                  disabled={imageLoading}
                />
              </label>
            )}
          </h3>

          <div className="relative">
            <ImageGallery
              images={trip.images.map((e) => e.imageUrl)}
              renderDelete={
                trip.status === "InProgress"
                  ? (idx) => (
                      <button
                        className="bg-white bg-opacity-80 rounded-full p-1 text-red-600 hover:text-red-800 shadow"
                        onClick={() => handleDeleteImage(idx)}
                        disabled={imageLoading}
                      >
                        <Trash2 size={20} />
                      </button>
                    )
                  : undefined
              }
            />
          </div>
        </div>
      )}

      {/* Location Map */}
      {trip.location && (
        <div>
          <h3 className="font-bold text-lg text-amber-700 pl-10 mb-2 flex items-center gap-2">
            Location
            {(trip.status === "Planned" || trip.status === "InProgress") && (
              <Button
                type="button"
                variant="edit"
                className="ml-4"
                onClick={() => {
                  setSelectedLocation({
                    latitude: trip.location.latitude,
                    longitude: trip.location.longitude,
                  });
                  setShowLocationModal(true);
                }}
              >
                Change Location
              </Button>
            )}
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

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Trip</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditTrip();
              }}
              className="space-y-4"
            >
              <TextInput
                label="Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <TextInput
                label="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  variant="cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="submit">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Select New Location
            </h2>
            <div className="mb-4">
              <Map
                latitude={selectedLocation?.latitude || trip.location.latitude}
                longitude={
                  selectedLocation?.longitude || trip.location.longitude
                }
                onClick={(lat: number, lng: number) =>
                  setSelectedLocation({ latitude: lat, longitude: lng })
                }
                marker={selectedLocation || trip.location}
              />
            </div>
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="cancel"
                onClick={() => setShowLocationModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="submit"
                onClick={handleSaveLocation}
                disabled={!selectedLocation}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetails;
