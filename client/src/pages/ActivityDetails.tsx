import React, { act, use, useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/UI/Button";
import ImageGallery from "../components/ImageGallery";
import Map from "../components/Map";
import H1 from "../components/UI/H1";
import { CalendarDays, Star } from "lucide-react";
import StartModal from "../components/StartModal";
import {
  finishTripActivity,
  getById,
  startTripActivity,
  updateTripActivity,
  cancelTripActivity,
} from "../services/TripActivityService";
import ActivityActions from "../components/ActivityActionButton";
import DateComponent from "../components/DateComponent";
import EditActivityButton from "../components/EditIcon";
import GalleryComponent from "../components/GalleryComponent";
import LocationModal from "../components/LocationModal";
import LocationComponent from "../components/LocationComponent";
import CancelModal from "../components/CancelModal";
import FinishTripActivityModal from "../components/FinishTripActivityModal";
import CreateModal from "../components/CreateModal";
import { resolve } from "path";
import { TripStatus } from "../types/enums/TripStatus";

const TripActivityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isTripComplete = searchParams.get("isTripComplete") === "true";

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
  //trip status
  const [tripStatus, setTripStatus] = useState(false);

  useEffect(() => {
    setLoading(true);
    //console.log(id);
    const fecthActivity = async () => {
      try {
        if (!id) return;
        const response = await getById(id);
        //console.log(response);
        setActivity(response);
        console.log(isTripComplete);
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
      //console.log(data);
      setActivity(data);
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
      setActivity(data);
      toast.success("Activity finished");
      setShowCompletetModal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to finish activity");
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleEditActivity = async (title: string) => {
    if (!activity) return;
    setEditLoading(true);
    try {
      await updateTripActivity(activity.id, { title });
      const response = await getById(activity.id);
      //console.log(response);
      setActivity(response);
      toast.success("Activity updated");
      setEditModal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update activity");
    } finally {
      setEditLoading(false);
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

  const handleCancelActivity = async (comment: string) => {
    if (!activity) return;
    try {
      await cancelTripActivity(activity.id, comment);
      const data = await getById(activity.id);
      setActivity(Array.isArray(data) ? data[0] : data);
      toast.success("Activity cancelled");
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel activity");
    }
  };

  const handleAddImages = async (files: FileList | null) => {
    if (!activity || !files) return;
    try {
      await updateTripActivity(activity.id, { images: Array.from(files) });
      const data = await getById(activity.id);
      setActivity(Array.isArray(data) ? data[0] : data);
      toast.success("Images added");
    } catch (err: any) {
      toast.error(err.message || "Failed to add images");
    }
  };

  const handleDeleteImage = async (idx: number) => {
    if (!activity || !activity.images || !activity.images[idx]) return;
    try {
      const imageUrl = activity.images[idx].imageUrl;
      console.log(imageUrl);
      await updateTripActivity(activity.id, { imagesToDelete: [imageUrl] });
      const data = await getById(activity.id);
      setActivity(Array.isArray(data) ? data[0] : data);
      toast.success("Image deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete image");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!activity) return <div className="p-6">Activity not found</div>;

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        {/* Title and actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1 items-center gap-2">
            <H1>{activity.title}</H1>
            {activity.status === "Completed" && (
              <div className="flex items-center text-amber-500 text-xl font-semibold">
                <Star className=" ml-4 w-5 h-5 fill-amber-500" />
                <span className="ml-1 text-base text-black">
                  {activity.rate ?? "N/A"}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-6 flex-shrink-0">
            <ActivityActions
              status={activity.status}
              onStart={() => setShowStartModal(true)}
              onFinish={() => setShowCompletetModal(true)}
              onCancel={() => setShowCancelModal(true)}
              tripStatus={isTripComplete}
            />
          </div>
          <div className="flex items-center gap-4 flex-1 justify-end text-sm text-gray-600">
            <DateComponent
              startDate={activity.startDate}
              endDate={activity.endDate}
              status={activity.status}
            />
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
              {activity.status}
            </span>
            <EditActivityButton
              status={activity.status}
              onClick={() => setEditModal(true)}
            />
          </div>
        </div>

        {/*comment*/}
        {(activity.status === "Completed" ||
          activity.status === "Cancelled") && (
          <>
            <h3 className="font-bold text-lg text-amber-700 pl-10 mb-2 flex items-center gap-2">
              Comment
            </h3>
            <p className="text-gray-700 pl-10 mb-2">{activity.comment}</p>
          </>
        )}

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
          canEdit={activity.status === "InProgress"}
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
      <CancelModal
        show={showCancelModal}
        loading={CancelLoading}
        onCancel={() => setShowCancelModal(false)}
        onSave={handleCancelActivity}
      />
      <FinishTripActivityModal
        show={showCompleteModal}
        loading={CompleteLoading}
        onCancel={() => setShowCompletetModal(false)}
        onSave={handleFinishActivity}
      />
      <CreateModal
        isCreate={false}
        show={showEditModal}
        onSave={handleEditActivity}
        onCancel={() => setEditModal(false)}
        loading={editLoading}
        initialTitle={activity.title}
      />
    </div>
  );
};

export default TripActivityDetails;
