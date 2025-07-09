import React, { useState } from "react";
import Button from "./UI/Button";

interface CancelModalProps {
  show: boolean;
  onSave: (comment: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CancelModal: React.FC<CancelModalProps> = ({
  show,
  onSave,
  onCancel,
  loading,
}) => {
  const [comment, setComment] = useState("");
  const [touched, setTouched] = useState(false);

  if (!show) return null;

  const isValid = comment.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Cancel Activity
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (!isValid) return;
            onSave(comment);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Comment
            </label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            {touched && !isValid && (
              <span className="text-red-500 text-xs">Comment is required.</span>
            )}
          </div>
          <div className="flex gap-4 justify-end mt-6">
            <Button type="button" variant="cancel" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="submit"
              disabled={loading || !isValid}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelModal;
