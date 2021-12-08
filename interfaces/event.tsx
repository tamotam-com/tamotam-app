import { Coordinate } from "./coordinate";

export interface Event {
  id: number;
  coordinate: Coordinate;
  description: string;
  imageUrl: string;
  title: string;
}
