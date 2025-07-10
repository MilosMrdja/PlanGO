import { Meta } from "react-router-dom";
import { TripCard } from "../types/TripCard";
import { FilterTripeRequest } from "../types/TripFilterRequest";
import { apiCall } from "./api";
import { TripStatus } from "../types/enums/TripStatus";

export const getAll = async (filter: {
  Title?: string;
  Status?: TripStatus;
  StartDate?: string;
  EndDate?: string;
  Rate?: number;
}): Promise<TripCard[]> => {
  const filterQ: Record<string, string> = {};

  if (filter.Title != null) filterQ.Title = filter.Title;
  if (filter.Status != null) filterQ.Status = filter.Status.toString();
  if (filter.StartDate != null) filterQ.StartDate = filter.StartDate;
  if (filter.EndDate != null) filterQ.EndDate = filter.EndDate;
  if (filter.Rate != null) filterQ.Rate = filter.Rate.toString();

  const query = new URLSearchParams(filterQ).toString();
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
  const response = await apiCall("api/trips", {
    method: "POST",
    body: JSON.stringify({
      Title: tripData.title,
    }),
    headers: {
      "Content-Type": "application/json",
    },
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

export const startTrip = async (id: number, startDate: string | Date) => {
  const response = await apiCall(`api/trips/${id}/start`, {
    method: "PUT",
    body: JSON.stringify({
      StartDate:
        typeof startDate === "string" ? startDate : startDate.toISOString(),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const finishTrip = async (
  tripId: number,
  endDate: string,
  rate: number,
  comment: string,
  images?: File[]
) => {
  const formData = new FormData();
  formData.append("EndDate", new Date(endDate).toISOString());
  formData.append("Rating.Rate", rate.toString());
  if (comment) formData.append("Rating.Comment", comment);
  if (images && images.length > 0) {
    images.forEach((img) => formData.append("Images", img));
  }
  const response = await apiCall(`api/trips/${tripId}/finish`, {
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
