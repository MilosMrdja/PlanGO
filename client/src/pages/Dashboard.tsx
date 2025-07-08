import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import FilterModal from '../components/FilterModal';
import { TripCard } from '../types/TripCard';
import { getAll as getAllTrips } from '../services/TripService';
import { toast } from 'react-toastify';

const trips = [
  {
    id: 1,
    title: 'Letovanje u Grčkoj',
    description: 'Odmor na moru sa porodicom.',
    startDate: '2024-08-01',
    status: 'Planned',
  },
  {
    id: 2,
    title: 'Planinarenje na Tari',
    description: 'Vikend avantura sa društvom.',
    startDate: '2024-07-15',
    status: 'InProgress',
  },
  {
    id: 3,
    title: 'Poseta Beču',
    description: 'Kratko putovanje u Austriju.',
    startDate: '2024-06-10',
    status: 'Completed',
  },
];

const Dashboard: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [trips, setTrips] = useState<TripCard[]>([])
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getAllTrips();
        setTrips(data);
        console.log(data)
      } catch (error) {
        toast.error("Error: fetchin trips")
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          
          <input
            type="text"
            placeholder="Pretraži putovanja..."
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => setShowFilter(true)}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Filteri
          </button>
        </div>
         
        {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
      </main>
    </div>
  );
};

export default Dashboard; 