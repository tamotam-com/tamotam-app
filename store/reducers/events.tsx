import { Event } from "../../interfaces/event";
import {
  ADD_EVENT,
  DELETE_EVENT,
  SAVE_EVENT,
  SET_USERS_EVENTS,
  UPDATE_EVENT,
} from "../actions/events";
import { EVENTS } from "../../data/dummy-data";

const initialState = {
  events: EVENTS,
  savedEvents: [],
  usersEvents: [],
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_EVENT:
      const newEvent: Event = {
        id: action.eventData.id,
        coordinate: {
          latitude: action.eventData.coordinate.latitude,
          longitude: action.eventData.coordinate.longitude,
        },
        date: action.eventData.date,
        description: action.eventData.description,
        imageUrl: action.eventData.imageUrl,
        title: action.eventData.title,
      };

      return {
        ...state,
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
        coordinate: {
          latitude: action.eventData.coordinate.latitude,
          longitude: action.eventData.coordinate.longitude,
        },
        date: action.eventData.date,
        description: action.eventData.description,
        imageUrl: action.eventData.imageUrl,
        title: action.eventData.title,
      };

      return {
        ...state,
        // @ts-ignore
        savedEvents: state.savedEvents.concat(savedEvent),
      };
    case SET_USERS_EVENTS:
      return {
        usersEvents: action.usersEvents,
      };
    case UPDATE_EVENT:
      const eventIndex = state.savedEvents.findIndex(
        (event: Event) => event.id === action.eventData.id
      );

      const updatedEvent: Event = {
        id: action.eventData.id,
        coordinate: {
          latitude: action.eventData.coordinate.latitude,
          longitude: action.eventData.coordinate.longitude,
        },
        date: action.eventData.date,
        description: action.eventData.description,
        imageUrl: action.eventData.imageUrl,
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
