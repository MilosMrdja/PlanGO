import { TripStatus } from "./enums/TripStatus";

export interface FilterTripeRequest {
  Title?: string;
  Status?: TripStatus;
  StartDate?: Date;
  EndDate?: Date;
  Rate?: number;
}
