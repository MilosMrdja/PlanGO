import React from "react";
import Button from "./UI/Button";
import TextInput from "./UI/TextInput";

interface EditTripModalProps {
  show: boolean;
  title: string;
  description: string;
  onTitleChange: (newTitle: string) => void;
  onDescriptionChange: (newDescription: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const EditTripModal: React.FC<EditTripModalProps> = ({
  show,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onClose,
  onSave,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Trip</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          <TextInput
            label="Title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
          <TextInput
            label="Description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />

          <div className="flex gap-4 mt-6 justify-end">
            <Button type="button" variant="cancel" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTripModal;
