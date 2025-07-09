import React, { useState } from "react";
import Button from "./UI/Button";
import { Star } from "lucide-react";

interface FinishTripActivityModalProps {
  show: boolean;
  onSave: (
    endDate: string,
    rate: number,
    comment: string,
    images?: File[]
  ) => void;
  onCancel: () => void;
  loading?: boolean;
}

const StarRating: React.FC<{
  value: number;
  onChange: (v: number) => void;
}> = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`cursor-pointer text-2xl ${
          star <= value ? "text-yellow-400" : "text-gray-300"
        }`}
        onClick={() => onChange(star)}
        data-testid={`star-${star}`}
      >
        ★
      </span>
    ))}
  </div>
);

const FinishTripActivityModal: React.FC<FinishTripActivityModalProps> = ({
  show,
  onSave,
  onCancel,
  loading,
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const [endDate, setEndDate] = useState(today);
  const [rate, setRate] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [touched, setTouched] = useState(false);

  if (!show) return null;

  const isValid = endDate && rate >= 1 && rate <= 5;

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
          Finish Activity
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (!isValid) return;
            onSave(endDate, rate, comment, images);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Rate (1-5)
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRate(star);
                    setTouched(true);
                  }}
                  className="focus:outline-none"
                  title={`Rate ${star}`}
                >
                  <Star
                    size={28}
                    className={
                      Number(star) <= Number(rate)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-400"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Comment (optional)
            </label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Images (optional)
            </label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setImages(e.target.files ? Array.from(e.target.files) : [])
              }
            />
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

export default FinishTripActivityModal;
