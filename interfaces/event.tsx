import { Coordinate } from "./coordinate";

export interface Event {
  id: number;
  coordinate: Coordinate;
  date: Date;
  description: string;
  imageUrl: string;
  isUserEvent: boolean;
  title: string;
}
