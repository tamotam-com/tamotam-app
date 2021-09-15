import * as Localization from "expo-localization";
import axios from "axios";
import { Coordinate } from "../../interfaces/coordinate";
import { Event } from "../../interfaces/event";
import {
  PREDICTHQ_ACCESS_TOKEN,
  PREDICTHQ_CATEGORIES,
  PREDICTHQ_LIMIT,
} from "@env";

export const ADD_EVENT = "ADD_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";
export const SET_EVENTS = "SET_EVENTS";
export const SET_FILTERS = "SET_FILTERS";
export const UPDATE_EVENT = "UPDATE_EVENT";

export const fetchEvents = () => {
  return async (dispatch: any) => {
    try {
      const response: any = await axios({
        method: "GET",
        url: "https://api.predicthq.com/v1/events/",
        headers: {
          Authorization: `Bearer ${PREDICTHQ_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
        params: {
          category: PREDICTHQ_CATEGORIES,
          country: Localization.region,
          limit: PREDICTHQ_LIMIT,
        },
      });

      if (!response.ok) {
        throw new Error("Error with fetching events");
      }

      const loadedEvents = [];

      for (const key in response) {
        loadedEvents.push({
          key,
          description: response.data.results[key].description,
          latitude: response.data.results[key].location[1],
          longitude: response.data.results[key].location[0],
          title: response.data.results[key].title,
        });
      }

      dispatch({ type: SET_EVENTS, events: loadedEvents });
    } catch (error) {
      console.log(error);
      // Send to some analytics server.
      throw error;
    }
  };
};

export const addEvent = (event: Event) => {
  return async (
    dispatch: (arg0: {
      type: string;
      eventData: {
        id: number;
        coordinate: { latitude: number; longitude: number };
        description: string;
        title: string;
      };
    }) => void
  ) => {
    dispatch({
      type: ADD_EVENT,
      eventData: {
        id: event.id,
        coordinate: {
          latitude: event.coordinate.latitude,
          longitude: event.coordinate.longitude,
        },
        description: event.description,
        title: event.title,
      },
    });
  };
};

export const deleteEvent = (eventId: number) => {
  return async (
    dispatch: (arg0: { type: string; event_id: number }) => void
  ) => {
    dispatch({ type: DELETE_EVENT, event_id: eventId });
  };
};

export const updateEvent = (event: Event) => {
  return async (
    dispatch: (arg0: {
      type: string;
      eventData: {
        id: number;
        coordinate: { latitude: number; longitude: number };
        description: string;
        title: string;
      };
    }) => void
  ) => {
    dispatch({
      type: UPDATE_EVENT,
      eventData: {
        id: event.id,
        coordinate: {
          latitude: event.coordinate.latitude,
          longitude: event.coordinate.longitude,
        },
        description: event.description,
        title: event.title,
      },
    });
  };
};

export const setFilters = (filterSettings: any) => {
  return { type: SET_FILTERS, filters: filterSettings };
};
