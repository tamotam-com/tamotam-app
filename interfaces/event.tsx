import { Coordinate } from "./coordinate";

export interface Event {
  id: number;
  coordinate: Coordinate;
  date: string;
  description: string;
  imageUrl: string;
  time: string;
  title: string;
}
