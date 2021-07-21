import { TOGGLE_FAVORITE, SET_FILTERS } from "../actions/events";

const initialState = {
  events: [],
  savedEvents: [],
};

const eventsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case TOGGLE_FAVORITE:
      console.log("toggle");
      // const existingIndex = state.savedEvents.findIndex((event: any) => event.id === action.eventId);
      const event = state.events.find(
        (event: any) => event.id === action.eventId
      );
      return { ...state, savedEvents: state.savedEvents.concat(event) };
    case SET_FILTERS:
      console.log("filters");
    default:
      return state;
  }
};

export default eventsReducer;