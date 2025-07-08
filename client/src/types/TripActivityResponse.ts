import { TripActivityStatus } from "./enums/TripActivityStatus";
import { ImageResponse } from "./ImageResponse";
import { LocationDTO } from "./LocationDTO";

export interface TripActivityResponse {
  Id: number;
  Title: string;
  StartDate: Date;
  EndDate: Date;
  Rate: number;
  Comment: string;
  Location: LocationDTO;
  Status: TripActivityStatus;
  Images: ImageResponse[];
}
