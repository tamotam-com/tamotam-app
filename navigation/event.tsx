import { Coordinate } from "./coordinate";

export interface Event {
  id: number;
  coordinate: Coordinate;
  description: string;
  title: string;
}
