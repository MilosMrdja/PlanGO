import { TripStatus } from "./enums/TripStatus";

export interface TripCard {
  Title: string;
  Description: string;
  StartDate: Date;
  Status: TripStatus;
}
