import React from 'react';

// Tip za props (putovanje)
type Trip = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  status: string;
};

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  // Boja statusa
  const statusColor =
    trip.status === 'Planned'
      ? 'bg-yellow-200 text-yellow-800'
      : trip.status === 'InProgress'
      ? 'bg-blue-200 text-blue-800'
      : 'bg-green-200 text-green-800';

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-800">{trip.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>{trip.status}</span>
      </div>
      <p className="text-gray-600 mb-2">{trip.description}</p>
      <div className="text-sm text-gray-500">Start date: {trip.startDate}</div>
    </div>
  );
};

export default TripCard; 