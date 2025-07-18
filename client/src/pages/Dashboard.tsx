import React, { useEffect, useState } from "react";
import FilterModal from "../components/FilterModal";
import { TripCard as TripCardResponse } from "../types/TripCard";
import { getAll, getAll as getAllTrips } from "../services/TripService";
import { toast } from "react-toastify";
import TripCard from "../components/TripCard";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import TripDetails from "./TripDetails";
import CreateModal from "../components/CreateModal";
import { createTrip } from "../services/TripService";
import { Plus, TreePalm } from "lucide-react";
import { useLocation } from "react-router-dom";
import TripActivityDetails from "./ActivityDetails";
import { TripStatus } from "../types/enums/TripStatus";
import { Search, Filter } from "lucide-react";
import { useAuth } from "../AuthProvider";
import localforage from "localforage";
import { TripOffline } from "../types/TripOffline";
import Navbar from "../components/Navbar";
import ArchivedTrips from "./ArchivedTrips";

const OFFLINE_TRIPS_KEY = "offline_trips";

async function saveOfflineTrip(trip: TripOffline) {
  const trips =
    (await localforage.getItem<TripOffline[]>(OFFLINE_TRIPS_KEY)) || [];
  trips.push(trip);
  await localforage.setItem(OFFLINE_TRIPS_KEY, trips);
}

async function getOfflineTrips() {
  return (await localforage.getItem<TripOffline[]>(OFFLINE_TRIPS_KEY)) || [];
}

async function clearOfflineTrips() {
  await localforage.removeItem(OFFLINE_TRIPS_KEY);
}

const Dashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showFilter, setShowFilter] = useState(false);
  const [trips, setTrips] = useState<TripCardResponse[]>([]);
  const [offlineTrips, setOfflineTrips] = useState<TripOffline[]>([]);
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
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
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

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Loaad offline trips when offline
  useEffect(() => {
    async function fetchData() {
      if (!isOnline) {
        const existingTrips: TripOffline[] = [];
        for (var trip of trips) {
          existingTrips.push({
            title: trip.title,
            createdAt: trip.startDate
              ? new Date(trip.startDate).toLocaleDateString()
              : "Planned trip",
            isSaved: true,
          });
        }
        const offlineTrips = await getOfflineTrips();
        const combinedTrips = [...existingTrips, ...offlineTrips];
        setOfflineTrips(combinedTrips);
      }
    }
    fetchData();
  }, [isOnline, showCreateTrip, trips]);

  const checkTitle = (title: string): boolean => {
    for (var tripO of offlineTrips) {
      if (tripO.title === title) {
        toast.error(`Trip with title ${title} already exist`);
        return false;
      }
    }
    return true;
  };
  // Create trip offline
  const handleCreateTripOffline = async (title: string) => {
    setCreateTripLoading(true);
    try {
      if (!checkTitle(title)) return;
      await saveOfflineTrip({
        title,
        createdAt: new Date().toDateString(),
        isSaved: false,
      });
      setShowCreateTrip(false);
      toast.success("You successfully created trip");
      // List of offline trips
      getOfflineTrips().then(setOfflineTrips);
    } catch (err: any) {
      toast.error("Error fetching offline trips");
    } finally {
      setCreateTripLoading(false);
    }
  };

  // Sync offline trips when back to online
  useEffect(() => {
    if (isOnline) {
      toast.success("Back online");
      (async () => {
        const offline = await getOfflineTrips();
        if (offline.length > 0) {
          for (const trip of offline) {
            try {
              await createTrip({ title: trip.title });
              toast.success(`Trip: ${trip.title} is created`);
            } catch (err) {
              toast.error(`Trip: ${trip.title} is not created`);
            }
          }
          await clearOfflineTrips();
          setOfflineTrips([]);
          // refresh trips
          const data = await getAllTrips({});
          setTrips(data);
        }
      })();
    }
  }, [isOnline]);

  const filterTrips = async (filter: {
    Title?: string;
    Status?: TripStatus;
    StartDate?: string;
    EndDate?: string;
    RateMin?: number;
    RateMax?: number;
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

  const isAnyFilterApplied = Object.values(lastFilters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isOnline={isOnline} onLogout={handleLogout} />
      <main className="p-8">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="flex items-center w-full mb-6">
                  <div className="w-1/3"></div>
                  <div className="w-1/3 flex items-center justify-center">
                    <input
                      type="text"
                      placeholder="Search trips"
                      className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      disabled={!isOnline}
                    />
                    <button
                      onClick={handleSearch}
                      className="ml-2 p-2 rounded-full bg-amber-800 text-white hover:bg-amber-600 transition-colors duration-200 flex items-center justify-center"
                      title="Search"
                      disabled={!isOnline}
                    >
                      <Search size={20} />
                    </button>
                    <button
                      onClick={() => setShowFilter(true)}
                      className={`ml-2 p-2 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        isAnyFilterApplied
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      title="Filter"
                      disabled={!isOnline}
                    >
                      <Filter size={20} />
                      {isAnyFilterApplied && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                          •
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="w-1/3 flex justify-end">
                    <button
                      onClick={() => setShowCreateTrip(true)}
                      className="cursor-pointer bg-green-200 rounded-full text-green-600 hover:text-green-800 p-2"
                      title="Add Trip"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                </div>
                {/* Offline or online trips */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {isOnline
                    ? trips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} />
                      ))
                    : offlineTrips.map((trip, idx) => (
                        <div
                          key={idx}
                          className={`rounded-lg shadow p-6 flex flex-col gap-2 opacity-80 ${
                            trip.isSaved
                              ? "bg-green-100 border-2 border-green-500"
                              : "bg-white border-2 border-dashed border-amber-400"
                          }`}
                        >
                          <span className="font-bold text-lg text-amber-700">
                            {trip.title}
                          </span>
                          <span className="text-xs text-gray-500">
                            {trip.isSaved ? "Created trip" : "Offline trip"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {trip.createdAt}
                          </span>
                        </div>
                      ))}
                </div>
                {showFilter && isOnline && (
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
          <Route path="archived" element={<ArchivedTrips />} />
        </Routes>
      </main>
      <CreateModal
        show={showCreateTrip}
        onSave={isOnline ? handleCreateTrip : handleCreateTripOffline}
        onCancel={() => setShowCreateTrip(false)}
        loading={createTripLoading}
        isCreate={true}
      />
    </div>
  );
};

export default Dashboard;
