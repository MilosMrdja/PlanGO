import React, { useState } from "react";
import { TripStatus } from "../types/enums/TripStatus";
import { UndoIcon } from "lucide-react";

interface FilterModalProps {
  onClose: () => void;
  onApplyFilter: (filters: {
    Status?: TripStatus;
    StartDate?: string;
    EndDate?: string;
    RateMin?: number;
    RateMax?: number;
  }) => void;
  onReset: () => void;
  initialFilters?: {
    Status?: TripStatus;
    StartDate?: string;
    EndDate?: string;
    RateMin?: number;
    RateMax?: number;
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
  const [rateMin, setRateMin] = useState(
    initialFilters?.RateMin?.toString() || ""
  );
  const [ratemax, setRateMax] = useState(
    initialFilters?.RateMax?.toString() || ""
  );
  const [rateMaxError, setRateMaxError] = useState("");
  const [rateMinError, setRateMinError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  const handleApply = () => {
    onApplyFilter({
      Status: status || undefined,
      StartDate: startDate || undefined,
      EndDate: endDate || undefined,
      RateMin: rateMin ? Number(rateMin) : undefined,
      RateMax: ratemax ? Number(ratemax) : undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setStatus("");
    setStartDate("");
    setEndDate("");
    setRateMin("");
    setRateMax("");
    onReset();
    onClose();
  };

  const handleRateMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const minValue = rateMin === "" ? 1 : Number(rateMin);
    setRateMax(value.toString());
    if (value >= minValue) {
      setRateMaxError("");
    } else {
      setRateMaxError("Max rating cannot be less than Min rating");
    }
  };

  const handleRateMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const maxValue = ratemax === "" ? 5 : Number(ratemax);
    setRateMin(value.toString());
    if (value <= maxValue) {
      setRateMinError("");
    } else {
      setRateMinError("Min rate cannot be greater than Max rating");
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = new Date(e.target.value);
    setStartDate(e.target.value);

    const endDateValue = endDate
      ? new Date(endDate)
      : new Date("9999-12-31T23:59");

    if (value <= endDateValue) {
      setStartDateError("");
    } else {
      setStartDateError("Start date must be before or equal to end date");
    }
  };

  const handleEndDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = new Date(e.target.value);
    setEndDate(e.target.value);

    const startDateValue = startDate
      ? new Date(startDate)
      : new Date("0001-01-01T00:01");
    if (value >= startDateValue) {
      setEndDateError("");
    } else {
      setEndDateError("End date must be after or equeal to start date");
    }
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
              onChange={handleStartDateChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          {startDateError && (
            <p className="text-red-500 text-sm mt-1">{startDateError}</p>
          )}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDataChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          {endDateError && (
            <p className="text-red-500 text-sm mt-1">{endDateError}</p>
          )}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Rate Min
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={rateMin}
              onChange={handleRateMinChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          {rateMinError && (
            <p className="text-red-500 text-sm mt-1">{rateMinError}</p>
          )}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Rate Max
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={ratemax}
              onChange={handleRateMaxChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          {rateMaxError && (
            <p className="text-red-500 text-sm mt-1">{rateMaxError}</p>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            disabled={
              rateMaxError !== "" ||
              rateMinError !== "" ||
              startDateError !== "" ||
              endDateError !== ""
            }
            onClick={handleApply}
            className="disabled:opacity-50 bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors duration-200"
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
