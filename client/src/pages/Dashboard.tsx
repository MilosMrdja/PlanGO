import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FilterModal from "../components/FilterModal";
import { TripCard as TripCardResponse } from "../types/TripCard";
import { getAll as getAllTrips } from "../services/TripService";
import { toast } from "react-toastify";
import TripCard from "../components/TripCard";
import { Routes, Route } from "react-router-dom";
import TripDetails from "./TripDetails";

const Dashboard: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [trips, setTrips] = useState<TripCardResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getAllTrips({});
        setTrips(data);
        console.log(data);
      } catch (error) {
        toast.error("Error: fetching trips");
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
        <Routes>
          <Route
            path="/"
            element={
              <>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {trips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
                {showFilter && (
                  <FilterModal onClose={() => setShowFilter(false)} />
                )}
              </>
            }
          />
          <Route path="trips/:id" element={<TripDetails />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
