import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/UI/Button";
import ImageGallery from "../components/ImageGallery";
import Map from "../components/Map";
import H1 from "../components/UI/H1";
import { CalendarDays } from "lucide-react";
import StartModal from "../components/StartModal";
import { startTripActivity } from "../services/TripActivityService";

// TODO: Importaj pravi tip kad budeš imao
// import { TripActivityResponse } from "../types/TripActivityResponse";

const TripActivityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);
  const [startLoading, setStartLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch activity by id
    setTimeout(() => {
      setActivity({
        id: 1,
        Title: "Sample Activity",
        StartDate: new Date().toISOString(),
        Status: "Planned",
        Images: ["/sample1.jpg", "/sample2.jpg"],
        Location: { latitude: 44.8, longitude: 20.5 },
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleStart = async (startDate: string) => {
    if (!activity) return;
    setStartLoading(true);
    try {
      await startTripActivity(activity.id, startDate);
      // TODO: Fetch updated activity
      toast.success("Activity started");
      setShowStartModal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to start activity");
    } finally {
      setStartLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!activity) return <div>Activity not found</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      {/* Title and actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <H1>{activity.Title}</H1>
          {(activity.Status === "Planned" ||
            activity.Status === "InProgress") && (
            <Button
              type="button"
              variant="submit"
              className="text-sm px-3 py-1"
              onClick={() => setShowStartModal(true)}
            >
              Start Activity
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-amber-800" />
            <span>
              {activity.StartDate
                ? `Start: ${new Date(activity.StartDate).toLocaleDateString()}`
                : "Unknown"}
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
            {activity.Status}
          </span>
        </div>
        <div className="ml-auto">
          {(activity.Status === "Planned" ||
            activity.Status === "InProgress") && (
            <button
              className="text-gray-500 hover:text-gray-700"
              title="Edit Activity"
            >
              ✏️
            </button>
          )}
        </div>
      </div>

      {/* Images */}
      {activity.Images && activity.Images.length > 0 && (
        <div>
          <h3 className="font-bold text-lg text-amber-700 pl-10 mb-2">
            Gallery
          </h3>
          <div className="relative">
            <ImageGallery images={activity.Images} />
          </div>
        </div>
      )}

      {/* Location Map */}
      {activity.Location && (
        <div>
          <h3 className="font-bold text-lg text-amber-700 pl-10 mb-2">
            Location
          </h3>
          <Map
            latitude={activity.Location.latitude}
            longitude={activity.Location.longitude}
          />
        </div>
      )}
      <StartModal
        show={showStartModal}
        type="activity"
        loading={startLoading}
        onCancel={() => setShowStartModal(false)}
        onSave={(startDate) => handleStart(startDate)}
      />
    </div>
  );
};

export default TripActivityDetails;
