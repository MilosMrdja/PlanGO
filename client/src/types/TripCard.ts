import { TripStatus } from "./enums/TripStatus";

export interface TripCard {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  status: TripStatus;
}
