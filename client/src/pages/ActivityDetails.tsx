import React, { act, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/UI/Button";
import ImageGallery from "../components/ImageGallery";
import Map from "../components/Map";
import H1 from "../components/UI/H1";
import { CalendarDays } from "lucide-react";
import StartModal from "../components/StartModal";
import {
  finishTripActivity,
  getById,
  startTripActivity,
  updateTripActivity,
} from "../services/TripActivityService";
import ActivityActions from "../components/ActivityActionButton";
import DateComponent from "../components/DateComponent";
import EditActivityButton from "../components/EditIcon";
import GalleryComponent from "../components/GalleryComponent";
import LocationModal from "../components/LocationModal";
import LocationComponent from "../components/LocationComponent";

const TripActivityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // start modal
  const [showStartModal, setShowStartModal] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  // complete modal
  const [showCompleteModal, setShowCompletetModal] = useState(false);
  const [CompleteLoading, setCompleteLoading] = useState(false);
  // cancel modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [CancelLoading, setCancelLoading] = useState(false);
  //edit modal
  const [showEditModal, setEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  //images
  const [imageLoading, setImageLoading] = useState(false);
  //location
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    console.log(id);
    const fecthActivity = async () => {
      try {
        if (!id) return;
        const response = await getById(id);
        console.log(response);
        setActivity(response);
      } catch (err: any) {
        toast.error(err.message || "Api failed");
      } finally {
        setLoading(false);
      }
    };
    fecthActivity();
  }, [id]);

  const handleStart = async (startDate: string) => {
    if (!activity) return;
    setStartLoading(true);
    try {
      await startTripActivity(activity.id, startDate);
      const data = await getById(activity.id);
      setActivity(data[0]);
      toast.success("Activity started");
      setShowStartModal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to start activity");
    } finally {
      setStartLoading(false);
    }
  };

  const handleFinishActivity = async (
    endDate: string,
    rate: number,
    comment: string,
    images?: File[]
  ) => {
    if (!activity) return;
    setCompleteLoading(true);
    try {
      await finishTripActivity(activity.id, endDate, rate, comment, images);
      const data = await getById(activity.id);
      setActivity(data[0]);
      toast.success("Activity started");
      setShowCompletetModal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to start activity");
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!activity || !selectedLocation) return;
    setLoading(true);
    try {
      await updateTripActivity(activity.id, {
        location: {
          Latitude: selectedLocation.latitude,
          Longitude: selectedLocation.longitude,
        },
        title: activity.title,
      });
      const data = await getById(activity.id);
      setActivity(data);
      toast.success("Location updated successfully");
      setShowLocationModal(false);
    } catch (err) {
      toast.error("Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelActivity = async (comment: string) => {};

  const handleAddImages = async (files: FileList | null) => {};

  const handleDeleteImage = async (idx: number) => {};

  if (loading) return <div className="p-6">Loading...</div>;
  if (!activity) return <div className="p-6">Activity not found</div>;

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        {/* Title and actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-8 p-2">
            <H1>{activity.title}</H1>
            <ActivityActions
              status={activity.status}
              onStart={() => setShowStartModal(true)}
              onFinish={() => setShowCompletetModal(true)}
              onCancel={() => setShowCancelModal(true)}
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <DateComponent
              startDate={activity.startDate}
              endDate={activity.endDate}
              status={activity.status}
            />
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
              {activity.status}
            </span>
          </div>
          <EditActivityButton
            status={activity.status}
            onClick={() => setEditModal(true)}
          />
        </div>

        {/* Images */}
        <GalleryComponent
          status={activity.status}
          images={activity.images}
          onAddImages={(files) => handleAddImages(files)}
          onDeleteImage={(idx) => handleDeleteImage(idx)}
          imageLoading={imageLoading}
        />

        {/* Location Map */}
        <LocationComponent
          location={activity.location}
          canEdit={
            activity.status === "Planned" || activity.status === "InProgress"
          }
          onEdit={() => {
            if (activity.location) {
              setSelectedLocation({
                latitude: activity.location.latitude,
                longitude: activity.location.longitude,
              });
            }
            setShowLocationModal(true);
          }}
        />
      </div>
      <StartModal
        show={showStartModal}
        type="activity"
        loading={startLoading}
        onCancel={() => setShowStartModal(false)}
        onSave={(startDate) => handleStart(startDate)}
      />
      <LocationModal
        show={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        selectedLocation={selectedLocation}
        tripLocation={activity.location}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
        onSave={handleSaveLocation}
        status={activity.status}
      />
    </div>
  );
};

export default TripActivityDetails;
