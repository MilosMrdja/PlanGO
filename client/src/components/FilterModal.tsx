import React, { useState } from "react";
import { TripStatus } from "../types/enums/TripStatus";

interface FilterModalProps {
  onClose: () => void;
  onApplyFilter: (filters: {
    Status?: TripStatus;
    StartDate?: string;
    EndDate?: string;
    Rate?: number;
  }) => void;
  onReset: () => void;
  initialFilters?: {
    Status?: TripStatus;
    StartDate?: string;
    EndDate?: string;
    Rate?: number;
  };
}

const FilterModal: React.FC<FilterModalProps> = ({
  onClose,
  onApplyFilter,
  onReset,
  initialFilters,
}) => {
  const [status, setStatus] = useState<TripStatus | "">(
    initialFilters?.Status || ""
  );
  const [startDate, setStartDate] = useState(initialFilters?.StartDate || "");
  const [endDate, setEndDate] = useState(initialFilters?.EndDate || "");
  const [rate, setRate] = useState(initialFilters?.Rate?.toString() || "");

  const handleApply = () => {
    onApplyFilter({
      Status: status || undefined,
      StartDate: startDate || undefined,
      EndDate: endDate || undefined,
      Rate: rate ? Number(rate) : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setStatus("");
    setStartDate("");
    setEndDate("");
    setRate("");
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Filteri</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TripStatus)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">All</option>
              <option value={TripStatus.Planned}>Planned</option>
              <option value={TripStatus.InProgress}>InProgress</option>
              <option value={TripStatus.Completed}>Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Rate</label>
            <input
              type="number"
              min={1}
              max={5}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={handleApply}
            className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors duration-200"
          >
            Save
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
