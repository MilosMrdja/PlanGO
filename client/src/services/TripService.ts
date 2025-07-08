import { Meta } from "react-router-dom";
import { TripCard } from "../types/TripCard";
import { FilterTripeRequest } from "../types/TripFilterRequest";
import { apiCall } from "./api";

export const getAll = async (
  filter: FilterTripeRequest
): Promise<TripCard[]> => {
  const query = new URLSearchParams(filter as any).toString();
  console.log(query);
  const reposnse = await apiCall(`api/trips?${query}`, {
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

export const createTrip = async (tripData: { title: string }) => {
  const formData = new FormData();
  formData.append("Title", tripData.title);
  const response = await apiCall("api/trips", {
    method: "POST",
    body: formData,
  });
  return response.data;
};

export const updateTrip = async (
  id: number,
  request: {
    title?: string;
    description?: string;
    images?: File[];
    imagesToDelete?: string[];
    location?: { Latitude: number; Longitude: number };
  }
) => {
  const formData = new FormData();
  if (request.title) formData.append("Title", request.title);
  if (request.description) formData.append("Description", request.description);

  if (request.images?.length) {
    request.images.forEach((file) => formData.append("Images", file));
  }

  if (request.imagesToDelete?.length) {
    request.imagesToDelete.forEach((name) =>
      formData.append("ImagesToDelete", name)
    );
  }

  if (request.location) {
    formData.append("Location.Latitude", request.location.Latitude.toString());
    formData.append(
      "Location.Longitude",
      request.location.Longitude.toString()
    );
  }
  const reposnse = await apiCall(`api/trips/${id}`, {
    method: "PUT",
    body: formData,
  });
  return reposnse.data;
};

export const startTrip = async (id: number, request: { startDate: Date }) => {
  const formData = new FormData();
  formData.append("StartDate", request.startDate.toISOString());
  const response = await apiCall(`api/trips/${id}/start`, {
    method: "PUT",
    body: formData,
  });
  return response.data;
};

/*headers: {
  // 'Content-Type': 'multipart/form-data', // Let browser set this for FormData
},*/

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
