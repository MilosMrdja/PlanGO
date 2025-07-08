import { TripCard } from "../types/TripCard";
import { apiCall } from "./api";

export const getAll = async (): Promise<TripCard[]> => {
  const reposnse = await apiCall("api/trips", {
    method: "GET",
  });
  return reposnse.data;
};

export const getById = async (id: string | number) => {
  const response = await apiCall(`api/trips/${id}`, {
    method: "GET",
  });
  return response.data;
};

export const createTrip = async (tripData: {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  location: { latitude: number; longitude: number };
  files: File[];
}) => {
  const formData = new FormData();
  formData.append("title", tripData.title);
  formData.append("description", tripData.description);
  formData.append("startDate", tripData.startDate.toISOString());
  formData.append("endDate", tripData.endDate.toISOString());
  formData.append("status", tripData.status);
  formData.append("latitude", String(tripData.location.latitude));
  formData.append("longitude", String(tripData.location.longitude));
  tripData.files.forEach((file) => {
    formData.append("files", file);
  });
  const response = await apiCall("api/trips", {
    method: "POST",
    body: formData,
    headers: {
      // 'Content-Type': 'multipart/form-data', // Let browser set this for FormData
    },
  });
  return response.data;
};

export const uploadImage = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  const response = await apiCall("api/images/upload", {
    method: "POST",
    body: formData,
  });
  return response.data;
};

export const uploadLocation = async (location: {
  latitude: number;
  longitude: number;
}) => {
  const response = await apiCall("api/locations", {
    method: "POST",
    body: JSON.stringify({
      latitude: location.latitude,
      longitude: location.longitude,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
