import { EVENTS } from "../../data/dummy-data";
import { ADD_EVENT, SET_FILTERS } from "../actions/events";
import { Event } from "../../interfaces/event";

const initialState = {
  events: EVENTS,
  savedEvents: [],
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_EVENT:
      const newEvent: Event = {
        id: 2,
        coordinate: { latitude: 51.23123, longitude: 4.921321 },
        description: "Description2",
        title: "Title2",
      };

      return {
        ...state,
        savedEvents: state.savedEvents.concat(newEvent),
      };
    case SET_FILTERS:
      console.log("filters");
    default:
      return state;
  }
};
