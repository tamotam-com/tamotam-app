import { EVENTS } from "../../data/dummy-data";
import { ADD_EVENT, DELETE_EVENT, UPDATE_EVENT } from "../actions/events";
import { Event } from "../../interfaces/event";

const initialState = {
  events: EVENTS,
  savedEvents: [],
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
