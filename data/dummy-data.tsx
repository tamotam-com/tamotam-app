import { Event } from "../interfaces/event";

export const EVENTS: Event[] = [
  {
    id: 1,
    coordinate: { latitude: 51.23123, longitude: 4.921321 },
    date: "January 12, 2022",
    description: "Description",
    imageUrl: "https://picsum.photos/700",
    time: "16:30",
    title: "Title",
  },
  {
    id: 2,
    coordinate: { latitude: 52.23123, longitude: 5.921321 },
    date: "January 20, 2022",
    description: "Description2",
    imageUrl: "https://picsum.photos/700",
    time: "19:00",
    title: "Title2",
  },
  {
    id: 3,
    coordinate: { latitude: 53.23123, longitude: 6.921321 },
    date: "February 1, 2022",
    description: "Description3",
    imageUrl: "https://picsum.photos/700",
    time: "20:00",
    title: "Title3",
  },
];
