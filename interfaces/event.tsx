import { Coordinate } from "./coordinate";

export interface Event {
  id: number | string;
  coordinate: Coordinate;
  date: Date;
  description: string;
  imageUrl: string;
  isUserEvent: boolean;
  title: string;
}
