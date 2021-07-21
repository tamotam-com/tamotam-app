import { Coordinate } from "./coordinate";

// class Event {
//   id: number;
//   coordinate: Coordinate;
//   description: string;
//   title: string;

//   constructor(
//     id: number,
//     coordinate: Coordinate,
//     description: string,
//     title: string
//   ) {
//     this.id = id;
//     this.coordinate = coordinate;
//     this.description = description;
//     this.title = title;
//   }
// }

// export default Event;

export interface Event {
  id: number;
  coordinate: Coordinate;
  description: string;
  title: string;
}
