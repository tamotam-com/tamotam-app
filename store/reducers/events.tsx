import { Event } from "../../interfaces/event";
import {
  ADD_EVENT,
  DELETE_EVENT,
  SAVE_EVENT,
  SET_EVENTS,
  SET_SAVED_EVENTS,
  UPDATE_EVENT,
} from "../actions/events";

const initialState = {
  events: [],
  savedEvents: [],
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_EVENT:
      const newEvent: Event = {
        id: action.eventData.id,
        date: action.eventData.date,
        description: action.eventData.description,
        firestoreDocumentId: action.eventData.firestoreDocumentId,
        imageUrl: action.eventData.imageUrl,
        isUserEvent: action.eventData.isUserEvent,
        latitude: action.eventData.latitude,
        longitude: action.eventData.longitude,
        title: action.eventData.title,
      };

      return {
        ...state,
        // @ts-ignore
        events: state.events.concat(newEvent),
      };
    case DELETE_EVENT:
      return {
        ...state,
        savedEvents: state.savedEvents.filter(
          (event: Event) => event.id !== action.eventData.id
        ),
      };
    case SAVE_EVENT:
      const savedEvent: Event = {
        id: action.eventData.id,
        date: action.eventData.date,
        description: action.eventData.description,
        firestoreDocumentId: action.eventData.firestoreDocumentId,
        imageUrl: action.eventData.imageUrl,
        isUserEvent: action.eventData.isUserEvent,
        latitude: action.eventData.latitude,
        longitude: action.eventData.longitude,
        title: action.eventData.title,
      };

      return {
        ...state,
        // @ts-ignore
        savedEvents: state.savedEvents.concat(savedEvent),
      };
    case SET_EVENTS:
      return {
        ...state,
        events: [...state.events, ...action.events],
      };
    case SET_SAVED_EVENTS:
      return {
        ...state,
        savedEvents: action.savedEvents,
      };
    case UPDATE_EVENT:
      const eventIndex = state.savedEvents.findIndex(
        (event: Event) => event.id === action.eventData.id
      );

      const updatedEvent: Event = {
        id: action.eventData.id,
        date: action.eventData.date,
        description: action.eventData.description,
        firestoreDocumentId: action.eventData.firestoreDocumentId,
        imageUrl: action.eventData.imageUrl,
        isUserEvent: action.eventData.isUserEvent,
        latitude: action.eventData.latitude,
        longitude: action.eventData.longitude,
        title: action.eventData.title,
      };

      const updatedEditEvents: Event[] = [...state.savedEvents];
      updatedEditEvents[eventIndex] = updatedEvent;

      return {
        ...state,
        savedEvents: updatedEditEvents,
      };
    default:
      return state;
  }
};
