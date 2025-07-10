import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import FilterModal from "../components/FilterModal";
import { TripCard as TripCardResponse } from "../types/TripCard";
import { getAll, getAll as getAllTrips } from "../services/TripService";
import { toast } from "react-toastify";
import TripCard from "../components/TripCard";
import { Routes, Route } from "react-router-dom";
import TripDetails from "./TripDetails";
import CreateModal from "../components/CreateModal";
import { createTrip } from "../services/TripService";
import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import TripActivityDetails from "./ActivityDetails";
import { FilterTripeRequest } from "../types/TripFilterRequest";
import { TripStatus } from "../types/enums/TripStatus";
import { Search, Filter } from "lucide-react";

const Dashboard: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [trips, setTrips] = useState<TripCardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [createTripLoading, setCreateTripLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [lastFilters, setLastFilters] = useState<{
    Title?: string;
    Status?: TripStatus;
    StartDate?: string;
    EndDate?: string;
    Rate?: number;
  }>({});
  const location = useLocation();
  const handleCreateTrip = async (title: string) => {
    setCreateTripLoading(true);
    try {
      await createTrip({ title: title });
      const data = await getAllTrips({});
      setTrips(data);
      setShowCreateTrip(false);
      toast.success("Trip created");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreateTripLoading(false);
    }
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getAllTrips({});
        setTrips(data);
        //console.log(data);
      } catch (error) {
        toast.error("Error: fetching trips");
      } finally {
        setLoading(false);
      }
    };
    if (location.pathname === "/dashboard") {
      fetchTrips();
    }
    fetchTrips();
  }, [location]);

  const filterTrips = async (filter: {
    Title?: string;
    Status?: TripStatus;
    StartDate?: string;
    EndDate?: string;
    Rate?: number;
  }) => {
    setLoading(true);
    try {
      const data = await getAllTrips(filter);
      setTrips(data);
      setLastFilters(filter);
    } catch (error) {
      toast.error("Error: fetching trips");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filters = { ...lastFilters, Title: searchTitle || undefined };
    filterTrips(filters);
  };
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // When FilterModal applies, combine with current searchTitle
  const handleApplyFilter = (filters: {
    Title?: string;
    Status?: TripStatus;
    StartDate?: string;
    EndDate?: string;
    Rate?: number;
  }) => {
    const combined = {
      ...filters,
      Title: searchTitle || filters.Title || undefined,
    };
    filterTrips(combined);
  };

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
                  <div className="flex items-center w-1/2">
                    <input
                      type="text"
                      placeholder="Search trips"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                    />
                    <button
                      onClick={handleSearch}
                      className="ml-2 p-2 rounded-full bg-amber-800 text-white hover:bg-amber-600 transition-colors duration-200 flex items-center justify-center"
                      title="Search"
                    >
                      <Search size={20} />
                    </button>
                    <button
                      onClick={() => setShowFilter(true)}
                      className="ml-2 p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                      title="Filter"
                    >
                      <Filter size={20} />
                    </button>
                  </div>
                  <button
                    onClick={() => setShowCreateTrip(true)}
                    className="cursor-pointer bg-green-200 rounded-full text-green-600 hover:text-green-800"
                    title="Add Activity"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {trips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
                {showFilter && (
                  <FilterModal
                    onClose={() => setShowFilter(false)}
                    onApplyFilter={handleApplyFilter}
                    onReset={() => {
                      setLastFilters({});
                      setSearchTitle("");
                      filterTrips({});
                    }}
                    initialFilters={lastFilters}
                  />
                )}
              </>
            }
          />
          <Route path="trips/:id" element={<TripDetails />} />
          <Route path="trip-activities/:id" element={<TripActivityDetails />} />
        </Routes>
      </main>
      <CreateModal
        show={showCreateTrip}
        onSave={handleCreateTrip}
        onCancel={() => setShowCreateTrip(false)}
        loading={createTripLoading}
        isCreate={true}
      />
    </div>
  );
};

export default Dashboard;
