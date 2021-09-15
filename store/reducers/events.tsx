import { EVENTS } from "../../data/dummy-data";
import {
  ADD_EVENT,
  DELETE_EVENT,
  SET_FILTERS,
  UPDATE_EVENT,
} from "../actions/events";
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
        title: action.eventData.title,
      };

      return {
        ...state,
        savedEvents: state.savedEvents.concat(newEvent),
      };
    case DELETE_EVENT:
      if (!state.savedEvents[action.event_id]) {
        return state;
      }

      const updatedEvents = { ...state.savedEvents };
      delete updatedEvents[action.event_id];
      return {
        ...state,
        savedEvents: updatedEvents,
      };
    case SET_FILTERS:
      console.log("filters");
    case UPDATE_EVENT:
      const updatedEvent: Event = {
        id: action.eventData.id,
        coordinate: {
          latitude: action.eventData.coordinate.latitude,
          longitude: action.eventData.coordinate.longitude,
        },
        description: action.eventData.description,
        title: action.eventData.title,
      };

      const updatedEditEvents: any = { ...state.savedEvents };
      updatedEditEvents[0] = updatedEvent;

      return {
        ...state,
        savedEvents: updatedEditEvents,
      };
    default:
      return state;
  }
};
