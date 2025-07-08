import { TripCard } from "../types/TripCard";
import { apiCall } from "./api";

export const getAll = async (): Promise<TripCard[]> => {
  return apiCall("api/trips", {
    method: "GET",
  });
};
