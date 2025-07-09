import React, { useEffect, useState } from "react";
import { Link, Route, useParams } from "react-router-dom";
import { TripResponse } from "../types/TripResponse";
import { toast } from "react-toastify";
import {
  getById,
  updateTrip,
  startTrip,
  finishTrip,
} from "../services/TripService";
import {
  createTripActivity,
  finishTripActivity,
  cancelTripActivity,
  deleteTripActivity,
} from "../services/TripActivityService";
import Button from "../components/UI/Button";
import ImageGallery from "../components/ImageGallery";
import Map from "../components/Map";
import H1 from "../components/UI/H1";
import { TripStatus } from "../types/enums/TripStatus";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import TextInput from "../components/UI/TextInput";
import { TripActivityStatus } from "../types/enums/TripActivityStatus";
import CreateModal from "../components/CreateModal";
import { title } from "process";
import StartModal from "../components/StartModal";
import { startTripActivity } from "../services/TripActivityService";
import CancelModal from "../components/CancelModal";
import FinishTripActivityModal from "../components/FinishTripActivityModal";
import CompleteTripModal from "../components/CompleteTripModal";
import TripActivityDetails from "./ActivityDetails";
import DateComponent from "../components/DateComponent";
import EditActivityButton from "../components/EditIcon";
import GalleryComponent from "../components/GalleryComponent";
import LocationModal from "../components/LocationModal";
import LocationComponent from "../components/LocationComponent";

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusColor, setStatusColor] = useState(
    "bg-yellow-200 text-yellow-800"
  );
  const [currentActivity, setCurrentActivity] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [createActivityLoading, setCreateActivityLoading] = useState(false);

  const [showStartTripModal, setShowStartTripModal] = useState(false);
  const [startTripLoading, setStartTripLoading] = useState(false);
  const [showCompleteTripModal, setShowCompleteTripModal] = useState(false);
  const [CompleteLoading, setCompleteLoading] = useState(false);

  const [showStartTripActivityModal, setShowStartTripActivityModal] =
    useState(false);
  const [showStartTripActivityLoading, setShowStartTripActivityLoading] =
    useState(false);

  const [showCancelActivityLoading, setShowCancelActivityLoading] =
    useState(false);
  const [showCancelActivityModal, setShowCancelActivityModal] = useState(false);

  const [showCompleteActivityLoading, setShowCompleteActivityLoading] =
    useState(false);
  const [showCompleteActivityModal, setShowCompleteActivityModal] =
    useState(false);

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

  const handleCreateActivty = async (title: string) => {
    if (!trip) return;
    setCreateActivityLoading(true);
    console.log(title);
    try {
      await createTripActivity(trip.id, title);
      const data = await getById(trip.id);
      setTrip(data[0]);
      setShowCreateActivity(false);
      toast.success("Activity created");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreateActivityLoading(false);
    }
  };

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

  function handleStartActivity(id: number): void {
    setCurrentActivity(id);
    setShowStartTripActivityModal(true);
  }

  function handleCancelActivity(id: number): void {
    setCurrentActivity(id);
    setShowCancelActivityModal(true);
  }

  function handleCompleteActivity(id: number): void {
    setCurrentActivity(id);
    setShowCompleteActivityModal(true);
  }

  const handleStartTrip = async (
    startDate: string,
    endDate?: string,
    rate?: number,
    comment?: string,
    images?: File[]
  ) => {
    if (!trip) return;
    setStartTripLoading(true);
    try {
      await startTrip(trip.id, startDate);
      const data = await getById(trip.id);
      setTrip(data[0]);
      setShowStartTripModal(false);
      toast.success("Trip started");
    } catch (err: any) {
      toast.error(err.message || "Failed to start trip");
    } finally {
      setStartTripLoading(false);
    }
  };

  const handleCompleteTrip = async (
    endDate: string,
    rate: number,
    comment: string,
    images?: File[]
  ) => {
    if (!trip) return;
    setCompleteLoading(true);
    try {
      await finishTrip(trip.id, endDate, rate, comment, images);
      const data = await getById(trip.id);
      setTrip(data[0]);
      setShowCompleteTripModal(false);
      toast.success("Trip completed");
    } catch (err: any) {
      toast.error(err.message || "Failed to complete trip");
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleCancelTripActivity = async (comment: string, idA?: number) => {
    setShowCancelActivityLoading(true);
    try {
      await cancelTripActivity(idA ?? currentActivity, comment);
      const data = await getById(id!);
      setTrip(data[0]);
      setShowCancelActivityModal(false);
      toast.success("Trip activity cancelled");
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel trip activity");
    } finally {
      setShowCancelActivityLoading(false);
    }
  };

  const handleCompleteTripActivity = async (
    endDate: string,
    rate: number,
    comment: string,
    images?: File[]
  ) => {
    if (!currentActivity) return;
    setShowCompleteActivityLoading(true);
    try {
      await finishTripActivity(currentActivity, endDate, rate, comment, images);
      const data = await getById(id!);
      setTrip(data[0]);
      setShowCompleteActivityModal(false);
      toast.success("Trip activity completed");
    } catch (err: any) {
      toast.error(err.message || "Failed to complete trip activity");
    } finally {
      setShowCompleteActivityLoading(false);
    }
  };

  const handleStartTripActivity = async (
    startDate: string,
    endDate?: string,
    rate?: number,
    comment?: string,
    images?: File[]
  ) => {
    if (!currentActivity) return;
    setShowStartTripActivityLoading(true);
    try {
      await startTripActivity(
        currentActivity,
        startDate,
        endDate,
        images,
        rate,
        comment
      );
      const data = await getById(id!);
      setTrip(data[0]);
      setShowStartTripActivityModal(false);
      toast.success("Trip activity started");
    } catch (err: any) {
      toast.error(err.message || "Failed to start trip activity");
    } finally {
      setShowStartTripActivityLoading(false);
    }
  };

  const handleDeleteTripActivity = async (id: number) => {
    setCompleteLoading(true);
    try {
      await deleteTripActivity(id);
      const data = await getById(trip!.id);
      setTrip(data[0]);
      toast.success("Activity deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete activity");
    } finally {
      setCompleteLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      {/* Title and rating */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Leva strana: Naslov + Start dugme */}
        <div className="flex items-center gap-4">
          <H1>{trip.title}</H1>
          {trip.status === "Planned" && (
            <Button
              type="button"
              variant="submit"
              className="text-sm px-3 py-1"
              onClick={() => setShowStartTripModal(true)}
            >
              Start Trip
            </Button>
          )}

          {trip.status === "InProgress" && (
            <Button
              type="button"
              variant="submit"
              className="text-sm px-3 py-1"
              onClick={() => setShowCompleteTripModal(true)}
              disabled={trip.tripActivities?.some(
                (activity) => activity.status === "InProgress"
              )}
            >
              Finish Trip
            </Button>
          )}
        </div>

        {/* Sredina: Datum + Status badge */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <DateComponent
            startDate={trip.startDate}
            endDate={trip.endDate}
            status={trip.status}
          />
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
          >
            {trip.status}
          </span>
        </div>

        {/* Desna strana: Edit dugme u obliku ikonice */}
        <EditActivityButton
          status={trip.status}
          onClick={() => setShowEditModal(true)}
        />
      </div>

      {/* Description */}
      <p className="text-gray-700 pl-10 mb-2">{trip.description}</p>

      {/* Images */}
      <GalleryComponent
        status={trip.status}
        images={trip.images}
        onAddImages={(files) => handleAddImages(files)}
        onDeleteImage={(idx) => handleDeleteImage(idx)}
        imageLoading={imageLoading}
      />

      {/* Location Map */}
      <LocationComponent
        location={trip.location}
        canEdit={trip.status === "Planned" || trip.status === "InProgress"}
        onEdit={() => {
          if (trip.location) {
            setSelectedLocation({
              latitude: trip.location.latitude,
              longitude: trip.location.longitude,
            });
          }
          setShowLocationModal(true);
        }}
      />

      {/* Future Activities Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-amber-700 mb-4 pl-10 flex items-center gap-2">
          Activities
          <button
            onClick={() => setShowCreateActivity(true)}
            className="cursor-pointer bg-green-200 rounded-full text-green-600 hover:text-green-800"
            title="Add Activity"
          >
            <Plus size={24} />
          </button>
        </h3>

        {trip.tripActivities && trip.tripActivities.length > 0 ? (
          <ul className="space-y-2 pl-10">
            {trip.tripActivities.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center justify-between p-3 bg-amber-50 rounded-md shadow-sm border border-amber-200"
              >
                {/* Left: title + link */}
                <Link
                  to={`/dashboard/trip-activities/${activity.id}`}
                  className="text-amber-800 font-semibold hover:underline"
                >
                  {activity.title}
                </Link>

                {/* Middle: Status badge */}
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    (console.log(
                      "status:",
                      activity.status,
                      TripActivityStatus.Completed
                    ),
                    activity.status === TripActivityStatus.Completed
                      ? "bg-green-100 text-green-800"
                      : activity.status === TripActivityStatus.Planned
                      ? "bg-yellow-100 text-yellow-800"
                      : activity.status === TripActivityStatus.InProgress
                      ? "bg-blue-100 text-blue-800"
                      : activity.status === TripActivityStatus.Cancelled
                      ? "bg-gray-100 text-gray-500"
                      : "")
                  }`}
                >
                  {activity.status}
                </span>

                {/* Right: buttons based on status */}
                <div className="flex gap-2">
                  {activity.status === TripActivityStatus.Planned && (
                    <>
                      <button
                        onClick={() => handleStartActivity(activity.id)}
                        className="text-xs text-blue-700 border border-blue-300 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Start
                      </button>
                      <button
                        onClick={() => handleCancelActivity(activity.id)}
                        className="text-xs text-red-700 border border-red-300 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {activity.status === TripActivityStatus.InProgress && (
                    <>
                      <button
                        onClick={() => handleCompleteActivity(activity.id)}
                        className="text-xs text-green-700 border border-green-300 px-2 py-1 rounded hover:bg-green-50"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleCancelActivity(activity.id)}
                        className="text-xs text-red-700 border border-red-300 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {/* No buttons if Completed or Canceled */}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic pl-10">
            No activities yet.
          </p>
        )}
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
      <LocationModal
        show={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        selectedLocation={selectedLocation}
        tripLocation={trip.location}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
        onSave={handleSaveLocation}
        status={trip.status}
      />
      <CreateModal
        show={showCreateActivity}
        onSave={handleCreateActivty}
        onCancel={() => setShowCreateActivity(false)}
        loading={createActivityLoading}
      />
      <StartModal
        show={showStartTripModal}
        type="trip"
        loading={startTripLoading}
        onCancel={() => setShowStartTripModal(false)}
        onSave={handleStartTrip}
      />
      <StartModal
        show={showStartTripActivityModal}
        type="activity"
        loading={showStartTripActivityLoading}
        onCancel={() => setShowStartTripActivityModal(false)}
        onSave={handleStartTripActivity}
      />
      <CancelModal
        show={showCancelActivityModal}
        loading={showCancelActivityLoading}
        onCancel={() => setShowCancelActivityModal(false)}
        onSave={handleCancelTripActivity}
      />
      <FinishTripActivityModal
        show={showCompleteActivityModal}
        loading={showCompleteActivityLoading}
        onCancel={() => setShowCompleteActivityModal(false)}
        onSave={handleCompleteTripActivity}
      />
      <CompleteTripModal
        show={showCompleteTripModal}
        loading={CompleteLoading}
        onCancel={() => setShowCompleteTripModal(false)}
        onSave={handleCompleteTrip}
        activities={trip.tripActivities.filter(
          (a) => a.status === TripActivityStatus.Planned
        )}
        onCancelActivity={handleCancelTripActivity}
        onDeleteActivity={handleDeleteTripActivity}
      />
    </div>
  );
};

export default TripDetails;
