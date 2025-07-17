import { TripStatus } from "./enums/TripStatus";
import { ImageResponse } from "./ImageResponse";
import { LocationDTO } from "./LocationDTO";
import { RatingResponse } from "./RatingResponse";
import { TripActivityResponse } from "./TripActivityResponse";

export interface TripResponse {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: TripStatus;
  images: ImageResponse[];
  location: LocationDTO;
  rating: RatingResponse;
  tripActivities: TripActivityResponse[];
  user: {
    FirstName: string;
    LastName: string;
  };
  isArchive: boolean;
}
