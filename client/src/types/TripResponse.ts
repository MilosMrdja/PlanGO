import { TripStatus } from "./enums/TripStatus";
import { ImageResponse } from "./ImageResponse";
import { LocationDTO } from "./LocationDTO";
import { RatingResponse } from "./RatingResponse";
import { TripActivityResponse } from "./TripActivityResponse";

export interface Trip {
  Id: number;
  Title: string;
  Description: string;
  StartDate: Date;
  EndDate: Date;
  Status: TripStatus;
  Images: ImageResponse[];
  Location: LocationDTO;
  Rating: RatingResponse;
  TripActivities: TripActivityResponse[];
  User: {
    FirstName: string;
    LastName: string;
  };
}
