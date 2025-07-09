import React, { useEffect, useState } from "react";
import Button from "./UI/Button";
import TextInput from "./UI/TextInput";

interface CreateModalProps {
  show: boolean;
  onSave: (title: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isCreate: boolean;
  initialTitle?: string;
}

const CreateModal: React.FC<CreateModalProps> = ({
  show,
  onSave,
  onCancel,
  loading,
  isCreate,
  initialTitle,
}) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!isCreate) {
      setTitle(initialTitle ?? "");
    } else {
      setTitle("");
    }
  }, [isCreate, initialTitle]);
  if (!show) return null;

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
          {isCreate ? "Create" : "Edit"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(title);
          }}
          className="space-y-4"
        >
          <TextInput
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="flex gap-4 justify-end mt-6">
            <Button type="button" variant="cancel" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="submit" disabled={loading || !title}>
              {isCreate ? "Create" : "Edit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
