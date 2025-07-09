import React from "react";
import Button from "./UI/Button";

type ActivityStatus = "Planned" | "InProgress" | "Completed" | "Canceled";

interface Props {
  status: ActivityStatus;
  onStart?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
  tripStatus: boolean;
}

const ActivityActions: React.FC<Props> = ({
  status,
  onStart,
  onFinish,
  onCancel,
  tripStatus,
}) => {
  if (status === "Completed" || status === "Canceled") {
    return null;
  }

  return (
    <>
      {tripStatus === false && (
        <div className="flex gap-2">
          {status === "Planned" && (
            <>
              <Button
                type="button"
                onClick={onStart}
                variant="submit"
                className="px-4 min-w-[80px]"
              >
                Start
              </Button>
              <Button
                type="button"
                onClick={onCancel}
                variant="submit"
                className="px-4 min-w-[80px]"
              >
                Cancel
              </Button>
            </>
          )}
          {status === "InProgress" && (
            <>
              <Button
                type="button"
                onClick={onFinish}
                variant="submit"
                className="px-4 min-w-[80px]"
              >
                Finish
              </Button>
              <Button
                type="button"
                onClick={onCancel}
                variant="submit"
                className="px-4 min-w-[80px]"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ActivityActions;
