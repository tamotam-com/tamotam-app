import { EVENTS } from "../../data/dummy-data";
import { TOGGLE_FAVORITE, SET_FILTERS } from "../actions/events";

const initialState = {
  events: EVENTS,
  savedEvents: [],
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case TOGGLE_FAVORITE:
      return {
        ...state,
        savedEvents: state.savedEvents.concat({
          id: 2,
          coordinate: { latitude: 51.23123, longitude: 4.921321 },
          description: "Description2",
          title: "Title2",
        }),
      };
    case SET_FILTERS:
      console.log("filters");
    default:
      return state;
  }
};
