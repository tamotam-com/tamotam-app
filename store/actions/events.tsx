import * as Localization from "expo-localization";
import axios from "axios";
import firestore from "@react-native-firebase/firestore";
import { Coordinate } from "../../interfaces/coordinate";
import { Event } from "../../interfaces/event";
import {
  FIRESTORE_COLLECTION,
  PREDICTHQ_ACCESS_TOKEN,
  PREDICTHQ_CATEGORIES,
  PREDICTHQ_LIMIT,
  // @ts-ignore
} from "@env";
import { EVENTS } from "../../data/dummy-data"; // TODO: Delete when PredictHQ will start working.

export const ADD_EVENT = "ADD_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";
export const SAVE_EVENT = "SAVE_EVENT";
export const SET_EVENTS = "SET_EVENTS";
export const SET_USERS_EVENTS = "SET_USERS_EVENTS";
export const UPDATE_EVENT = "UPDATE_EVENT";

export const fetchEvents = () => {
  return async (dispatch: any) => {
    try {
      const response: any = await axios({
        headers: {
          Authorization: `Bearer ${PREDICTHQ_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
        method: "GET",
        params: {
          category: PREDICTHQ_CATEGORIES,
          country: Localization.region,
          limit: PREDICTHQ_LIMIT,
        },
        url: "https://api.predicthq.com/v1/events/",
      });

      if (!response.ok) {
        throw new Error("Error with fetching events");
      }

      const loadedEvents: any[] = [];

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
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        // Send to some analytics server.
        throw err;
      }
    }
  };
};

export const fetchUsersEvents = () => {
  return async (dispatch: any) => {
    try {
      const loadedEvents: any[] = [];

      const promise1 = await firestore()
        .collection(FIRESTORE_COLLECTION)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            loadedEvents.push({
              coordinate: {
                latitude: documentSnapshot.data().coordinate.latitude,
                longitude: documentSnapshot.data().coordinate.longitude,
              },
              date: new Date(documentSnapshot.data().date.seconds * 1000),
              description: documentSnapshot.data().description,
              id: documentSnapshot.id,
              imageUrl: "https://picsum.photos/700",
              title: documentSnapshot.data().title,
            });
          });
        });

      Promise.race([promise1]).then(() => {
        const finalEvents = [...loadedEvents, ...EVENTS];
        dispatch({ type: SET_USERS_EVENTS, events: finalEvents });
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        // Send to some analytics server.
        throw err;
      }
    }
  };
};

export const addEvent = (event: Event) => {
  return async (
    dispatch: (arg0: {
      type: string;
      eventData: {
        id: number;
        coordinate: Coordinate;
        date: Date;
        description: string;
        imageUrl: string;
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
        date: event.date,
        description: event.description,
        imageUrl: event.imageUrl,
        title: event.title,
      },
    });
  };
};

export const deleteEvent = (event: Event) => {
  return async (
    dispatch: (arg0: {
      type: string;
      eventData: {
        id: number;
        coordinate: Coordinate;
        date: Date;
        description: string;
        imageUrl: string;
        title: string;
      };
    }) => void
  ) => {
    dispatch({
      type: DELETE_EVENT,
      eventData: {
        id: event.id,
        coordinate: {
          latitude: event.coordinate.latitude,
          longitude: event.coordinate.longitude,
        },
        date: event.date,
        description: event.description,
        imageUrl: event.imageUrl,
        title: event.title,
      },
    });
  };
};

export const saveEvent = (event: Event) => {
  return async (
    dispatch: (arg0: {
      type: string;
      eventData: {
        id: number;
        coordinate: Coordinate;
        date: Date;
        description: string;
        imageUrl: string;
        title: string;
      };
    }) => void
  ) => {
    dispatch({
      type: SAVE_EVENT,
      eventData: {
        id: event.id,
        coordinate: {
          latitude: event.coordinate.latitude,
          longitude: event.coordinate.longitude,
        },
        date: event.date,
        description: event.description,
        imageUrl: event.imageUrl,
        title: event.title,
      },
    });
  };
};

export const updateEvent = (event: Event) => {
  return async (
    dispatch: (arg0: {
      type: string;
      eventData: {
        id: number;
        coordinate: Coordinate;
        date: Date;
        description: string;
        imageUrl: string;
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
        date: event.date,
        description: event.description,
        imageUrl: event.imageUrl,
        title: event.title,
      },
    });
  };
};
