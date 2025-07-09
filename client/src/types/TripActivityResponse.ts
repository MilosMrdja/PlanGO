import { TripActivityStatus } from "./enums/TripActivityStatus";
import { TripStatus } from "./enums/TripStatus";
import { ImageResponse } from "./ImageResponse";
import { LocationDTO } from "./LocationDTO";

export interface TripActivityResponse {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  rate: number;
  comment: string;
  location: LocationDTO;
  status: TripActivityStatus;
  images: ImageResponse[];
  TripStatus: TripStatus;
}
