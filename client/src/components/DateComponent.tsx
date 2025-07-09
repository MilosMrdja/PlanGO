import { CalendarDays } from "lucide-react";

interface TripDateRangeProps {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  status?: "Planned" | "InProgress" | "Completed" | "Canceled";
}

const TripDateRange: React.FC<TripDateRangeProps> = ({
  startDate,
  endDate,
  status,
}) => {
  const formatDate = (date?: string | Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString();
  };

  const renderDateText = () => {
    if (status === "Completed" && startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    if (startDate) {
      return `${formatDate(startDate)}`;
    }

    return "Unknown";
  };

  return (
    <div className="flex items-center gap-2 text-sm text-amber-800">
      <CalendarDays className="w-4 h-4" />
      <span>{renderDateText()}</span>
    </div>
  );
};

export default TripDateRange;
