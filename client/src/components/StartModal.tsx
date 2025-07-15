import React, { useState } from "react";
import Button from "./UI/Button";
import TextInput from "./UI/TextInput";
import { Star } from "lucide-react";

interface StartModalProps {
  show: boolean;
  type: "trip" | "activity";
  onSave: (
    startDate: string,
    endDate?: string,
    rate?: number,
    comment?: string,
    images?: File[]
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const StartModal: React.FC<StartModalProps> = ({
  show,
  type,
  onSave,
  onCancel,
  loading,
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [withEndDate, setWithEndDate] = useState(false);
  const [endDate, setEndDate] = useState(today);
  const [rate, setRate] = useState<number | "">("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [touched, setTouched] = useState(false);

  if (!show) return null;

  const isEndSectionValid =
    !withEndDate ||
    (rate !== "" && rate >= 1 && rate <= 5 && comment.trim().length > 0);

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
          Start {type === "trip" ? "Trip" : "Activity"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (withEndDate && !isEndSectionValid) return;
            if (type === "activity" && withEndDate) {
              onSave(startDate, endDate, Number(rate), comment, images);
            } else {
              onSave(startDate);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              max={today}
            />
          </div>
          {type === "activity" && (
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={withEndDate}
                  onChange={(e) => setWithEndDate(e.target.checked)}
                />
                Add End Date
              </label>
              {withEndDate && (
                <div className="mt-2 space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="border rounded px-3 py-2 w-full"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
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
                    {touched && (Number(rate) < 1 || Number(rate) > 5) && (
                      <span className="text-red-500 text-xs">
                        Rate must be between 1 and 5.
                      </span>
                    )}
                  </div>
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
                    {touched && comment.trim().length === 0 && (
                      <span className="text-red-500 text-xs">
                        Comment is required.
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Images (optional)
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        setImages(
                          e.target.files ? Array.from(e.target.files) : []
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-4 justify-end mt-6">
            <Button type="button" variant="cancel" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="submit"
              disabled={loading || (withEndDate && !isEndSectionValid)}
            >
              Start
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartModal;
