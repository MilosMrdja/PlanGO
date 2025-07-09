import React from "react";

type ActivityStatus = "Planned" | "InProgress" | "Completed" | "Canceled";

interface EditActivityButtonProps {
  status: ActivityStatus;
  onClick?: () => void;
}

const EditActivityButton: React.FC<EditActivityButtonProps> = ({
  status,
  onClick,
}) => {
  const isEditable = status === "Planned" || status === "InProgress";

  if (!isEditable) return null;

  return (
    <div className="">
      <button
        className="text-gray-500 hover:text-gray-700"
        title="Edit Activity"
        onClick={onClick}
      >
        ✏️
      </button>
    </div>
  );
};

export default EditActivityButton;
