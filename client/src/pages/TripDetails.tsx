import React, { useEffect, useState } from "react";
import { Link, Route, useParams } from "react-router-dom";
import { TripResponse } from "../types/TripResponse";
import { toast } from "react-toastify";
import {
  getById,
  updateTrip,
  startTrip,
  finishTrip,
  generatePdf,
  archiveTrip,
  unarchiveTrip,
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
import {
  CalendarDays,
  Plus,
  Star,
  Trash2,
  Download,
  Archive,
  ArchiveRestore,
} from "lucide-react";
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
import TripActivitiesModal from "../components/ListActivityModal";
import EditTripModal from "../components/EditTripModal";
import TripActivitiesList from "../components/ListActivityModal";

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
  const [archiveLoading, setArchiveLoading] = useState(false);

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

  const [showActivitiesModal, setShowActivitiesModal] = useState(false);

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

  const handleDownloadPdf = async () => {
    if (!trip) return;
    try {
      const blob = await generatePdf(trip.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${trip.title || "trip"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download PDF");
    }
  };
  const handleUnarchiveTrip = async () => {
    setArchiveLoading(true);
    try {
      await unarchiveTrip(trip.id.toString());
      const data = await getById(trip.id);
      setTrip(data[0]);
      toast.success("Trip unarchived");
    } catch (err) {
      toast.error("Failed to unarchive trip");
    } finally {
      setArchiveLoading(false);
    }
  };

  const handleArchiveTrip = async () => {
    setArchiveLoading(true);
    try {
      await archiveTrip(trip.id.toString());
      const data = await getById(trip.id);
      setTrip(data[0]);
      toast.success("Trip archived");
    } catch (err) {
      toast.error("Failed to archive trip");
    } finally {
      setArchiveLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      {/* Title and rating */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Leva strana: Naslov */}
        <div className="flex items-center gap-2">
          <H1>{trip.title}</H1>
          {/* Arhiviranje/unarhiviranje samo za completed tripove */}
          {trip.status === TripStatus.Completed && !trip.isArchive && (
            <button
              className="ml-4 p-2 rounded-full bg-amber-800 text-white hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
              title="Archive trip"
              onClick={handleArchiveTrip}
            >
              <Archive size={20} />
            </button>
          )}
          {trip.status === TripStatus.Completed && trip.isArchive && (
            <button
              className="ml-4 p-2 rounded-full bg-amber-800 text-white hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
              title="Unarchive trip"
              onClick={handleUnarchiveTrip}
            >
              <ArchiveRestore size={20} />
            </button>
          )}

          {trip.status === "Completed" && (
            <div className="flex items-center text-amber-500 text-xl font-semibold">
              <Star className=" ml-4 w-5 h-5 fill-amber-500" />
              <span className="ml-1 text-base text-black">
                {trip.rating.rate?.toFixed(2) ?? "N/A"}
              </span>
              <button
                onClick={handleDownloadPdf}
                className="ml-4 p-2 rounded-full bg-amber-800 text-white hover:bg-amber-600 transition-colors duration-200 flex items-center justify-center"
                title="Download PDF"
              >
                <Download size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Sredina: Dugme */}
        <div className="flex justify-center gap-4 flex-shrink-0">
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

        {/* Desna strana:  */}
        <div className="flex items-center gap-4 flex-1 justify-end text-sm text-gray-600">
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
          <EditActivityButton
            status={trip.status}
            onClick={() => setShowEditModal(true)}
          />
        </div>
      </div>

      {/* Description */}
      <h3 className="font-bold text-lg text-amber-700 pl-10 mb-2 flex items-center gap-2">
        Description
      </h3>
      <p className="text-gray-700 pl-10 mb-2">{trip.description}</p>
      {trip.status === TripStatus.Completed && (
        <>
          <h3 className="font-bold text-lg text-amber-700 pl-10 mb-2 flex items-center gap-2">
            Comment
          </h3>
          <p className="text-gray-700 pl-10 mb-2">{trip.rating.comment}</p>
        </>
      )}

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
          {trip.status !== TripStatus.Completed && (
            <button
              onClick={() => setShowCreateActivity(true)}
              className="cursor-pointer bg-green-200 rounded-full text-green-600 hover:text-green-800"
              title="Add Activity"
            >
              <Plus size={24} />
            </button>
          )}
        </h3>

        <TripActivitiesList
          activities={trip.tripActivities}
          onStart={handleStartActivity}
          onComplete={handleCompleteActivity}
          onCancel={handleCancelActivity}
          isCompleted={trip.status === TripStatus.Completed}
        />
      </div>

      <EditTripModal
        show={showEditModal}
        title={editTitle}
        description={editDescription}
        onTitleChange={setEditTitle}
        onDescriptionChange={setEditDescription}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditTrip}
      />
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
        isCreate={true}
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
