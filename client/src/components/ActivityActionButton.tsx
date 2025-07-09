import React from "react";
import Button from "./UI/Button";

type ActivityStatus = "Planned" | "InProgress" | "Completed" | "Canceled";

interface Props {
  status: ActivityStatus;
  onStart?: () => void;
  onFinish?: () => void;
  onCancel?: () => void;
}

const ActivityActions: React.FC<Props> = ({
  status,
  onStart,
  onFinish,
  onCancel,
}) => {
  if (status === "Completed" || status === "Canceled") {
    return null;
  }

  return (
    <div className="flex gap-2">
      {status === "Planned" && (
        <>
          <Button type="button" onClick={onStart} variant="submit">
            Start
          </Button>
          <Button type="button" onClick={onCancel} variant="submit">
            Cancel
          </Button>
        </>
      )}
      {status === "InProgress" && (
        <>
          <Button type="button" onClick={onFinish} variant="submit">
            Finish
          </Button>
          <Button type="button" onClick={onCancel} variant="submit">
            Cancel
          </Button>
        </>
      )}
    </div>
  );
};

export default ActivityActions;
