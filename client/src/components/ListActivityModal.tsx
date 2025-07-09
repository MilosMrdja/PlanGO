import React from "react";
import { Link } from "react-router-dom";
import { TripActivityStatus } from "../types/enums/TripActivityStatus";

interface Activity {
  id: number;
  title: string;
  status: TripActivityStatus;
}

interface Props {
  activities: Activity[];
  onStart: (id: number) => void;
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
  isCompleted: boolean;
}

const TripActivitiesList: React.FC<Props> = ({
  activities,
  onStart,
  onComplete,
  onCancel,
  isCompleted,
}) => {
  if (!activities || activities.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic pl-10">No activities yet.</p>
    );
  }

  return (
    <ul className="space-y-2 pl-10">
      {activities.map((activity) => (
        <li
          key={activity.id}
          className="flex items-center justify-between p-3 bg-amber-50 rounded-md shadow-sm border border-amber-200"
        >
          {/* Left: title + link */}
          <Link
            to={`/dashboard/trip-activities/${activity.id}`}
            state={{ isTripComplete: isCompleted }}
            className="text-amber-800 font-semibold hover:underline"
          >
            {activity.title}
          </Link>

          {/* Middle: Status badge */}
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              activity.status === TripActivityStatus.Completed
                ? "bg-green-100 text-green-800"
                : activity.status === TripActivityStatus.Planned
                ? "bg-yellow-100 text-yellow-800"
                : activity.status === TripActivityStatus.InProgress
                ? "bg-blue-100 text-blue-800"
                : activity.status === TripActivityStatus.Cancelled
                ? "bg-gray-100 text-gray-500"
                : ""
            }`}
          >
            {activity.status}
          </span>

          {/* Right: buttons based on status */}
          {isCompleted === false && (
            <div className="flex gap-2">
              {activity.status === TripActivityStatus.Planned && (
                <>
                  <button
                    onClick={() => onStart(activity.id)}
                    className="text-xs text-blue-700 border border-blue-300 px-2 py-1 rounded hover:bg-blue-50"
                  >
                    Start
                  </button>
                  <button
                    onClick={() => onCancel(activity.id)}
                    className="text-xs text-red-700 border border-red-300 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Cancel
                  </button>
                </>
              )}
              {activity.status === TripActivityStatus.InProgress && (
                <>
                  <button
                    onClick={() => onComplete(activity.id)}
                    className="text-xs text-green-700 border border-green-300 px-2 py-1 rounded hover:bg-green-50"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => onCancel(activity.id)}
                    className="text-xs text-red-700 border border-red-300 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TripActivitiesList;
