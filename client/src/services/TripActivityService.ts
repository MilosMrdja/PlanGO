import { apiCall } from "./api";

export const getById = async (id: string | number) => {
  const response = await apiCall(`api/trip-activities/${id}`, {
    method: "GET",
  });
  return response.data;
};

export const createTripActivity = async (tripId: number, title: string) => {
  const response = await apiCall("api/trip-activities", {
    method: "POST",
    body: JSON.stringify({
      TripId: tripId,
      Title: title,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const startTripActivity = async (
  activityId: number,
  startDate: string | Date,
  endDate?: string | Date,
  images?: File[],
  rate?: number,
  comment?: string
) => {
  if (!activityId || !startDate) {
    throw new Error("Activity ID and start date are required.");
  }

  const formData = new FormData();

  const isoStartDate =
    typeof startDate === "string"
      ? new Date(startDate).toISOString()
      : startDate.toISOString();
  formData.append("StartDate", isoStartDate);

  if (endDate) {
    const isoEndDate =
      typeof endDate === "string"
        ? new Date(endDate).toISOString()
        : endDate.toISOString();
    formData.append("EndDate", isoEndDate);
  }

  if (rate !== undefined) {
    formData.append("Rate", rate.toString());
  }

  if (comment?.trim()) {
    formData.append("Comment", comment.trim());
  }

  if (images && images.length > 0) {
    images.forEach((img, index) => {
      formData.append("Images", img);
    });
  }

  const response = await apiCall(`api/trip-activities/${activityId}/start`, {
    method: "PUT",
    body: formData,
  });

  return response.data;
};

export const finishTripActivity = async (
  activityId: number,
  endDate: string,
  rate: number,
  comment: string,
  images?: File[]
) => {
  const formData = new FormData();
  formData.append("EndDate", new Date(endDate).toISOString());
  formData.append("Rate", rate.toString());
  if (comment) formData.append("Comment", comment);
  if (images && images.length > 0) {
    images.forEach((img) => formData.append("Images", img));
  }
  const response = await apiCall(`api/trip-activities/${activityId}/finish`, {
    method: "PUT",
    body: formData,
  });
  return response.data;
};

export const cancelTripActivity = async (
  activityId: number,
  comment: string
) => {
  const response = await apiCall(`api/trip-activities/${activityId}/cancel`, {
    method: "PUT",
    body: JSON.stringify({
      Comment: comment,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteTripActivity = async (activityId: number) => {
  const response = await apiCall(`api/trip-activities/${activityId}`, {
    method: "DELETE",
  });
  console.log(response);
  return response;
};

export const updateTripActivity = async (
  id: number,
  request: {
    title?: string;
    images?: File[];
    imagesToDelete?: string[];
    location?: { Latitude: number; Longitude: number };
  }
) => {
  const formData = new FormData();
  if (request.title) formData.append("Title", request.title);

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
  const reposnse = await apiCall(`api/trip-activities/${id}`, {
    method: "PUT",
    body: formData,
  });
  return reposnse.data;
};
