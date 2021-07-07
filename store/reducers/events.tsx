import { TOGGLE_FAVORITE, SET_FILTERS } from "../actions/events";

const initialState = {
  events: [],
  savedEvents: [],
};

const eventsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case TOGGLE_FAVORITE:
      console.log("toggle");
    case SET_FILTERS:
      console.log("filters");
    default:
      return state;
  }
};

export default eventsReducer;
