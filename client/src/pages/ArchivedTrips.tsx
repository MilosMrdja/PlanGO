import React, { useEffect, useState } from "react";
import { getArchivedAll } from "../services/TripService";
import TripCard from "../components/TripCard";
import { TripCard as TripCardResponse } from "../types/TripCard";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { useAuth } from "../AuthProvider";

const ArchivedTrips: React.FC = () => {
  const [trips, setTrips] = useState<TripCardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchArchived = async () => {
      try {
        const data = await getArchivedAll();
        setTrips(data);
      } catch (err) {
        toast.error("Error: fetching archived trips");
      } finally {
        setLoading(false);
      }
    };
    fetchArchived();
  }, []);

  if (loading) return <div>Loading archived trips...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {trips.length === 0 ? (
            <div className="text-gray-500">No archived trips.</div>
          ) : (
            trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivedTrips;
