import React from 'react';
import {TripCard as TripCardResponse } from '../types/TripCard';
import { TripStatus } from '../types/enums/TripStatus';
import { useNavigate } from 'react-router-dom';


interface TripCardProps {
  trip: TripCardResponse;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate();
  // Boja statusa
  const statusColor =
    trip.status === TripStatus.Planned
      ? 'bg-yellow-200 text-yellow-800'
      : trip.status === TripStatus.InProgress
      ? 'bg-blue-200 text-blue-800'
      : 'bg-green-200 text-green-800';


  return (
    <div
      className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => navigate(`/dashboard/trips/${trip.id}`)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-800">{trip.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>{trip.status}</span>
      </div>
      <p className="text-gray-600 mb-2">{trip.description ?? "Unknow description"}</p>
      <div className="text-sm text-gray-500">
  Start date: {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-EN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) : 'Planned'}
</div>

    </div>
  );
};

export default TripCard; 