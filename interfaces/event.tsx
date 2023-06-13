export interface Event {
  id: number | string;
  date: Date;
  description: string;
  firestoreDocumentId?: string;
  imageUrl: string;
  isUserEvent: boolean;
  latitude: number;
  longitude: number;
  title: string;
}
