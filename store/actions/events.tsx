import * as Localization from "expo-localization";
import axios, { AxiosResponse } from "axios";
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
export const UPDATE_EVENT = "UPDATE_EVENT";

export const fetchEvents = () => {
  return async (dispatch: any) => {
    try {
      const predictHqEvents: any[] = [];
      const usersEvents: any[] = [];

      const promisePredictHqEvents: void | AxiosResponse<any, any> | any =
        await axios({
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
        }).catch((error: unknown) => {
          if (error instanceof Error) {
            console.error(
              "Error with fetching PredictHQ events, details: ",
              error
            );
          }
        });

      for (const key in promisePredictHqEvents) {
        predictHqEvents.push({
          key,
          description: promisePredictHqEvents.data.results[key].description,
          latitude: promisePredictHqEvents.data.results[key].location[1],
          longitude: promisePredictHqEvents.data.results[key].location[0],
          title: promisePredictHqEvents.data.results[key].title,
        });
      }

      const promiseUsersEvents: void = await firestore()
        .collection(FIRESTORE_COLLECTION)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            usersEvents.push({
              id: documentSnapshot.data().id,
              coordinate: {
                latitude: documentSnapshot.data().coordinate.latitude,
                longitude: documentSnapshot.data().coordinate.longitude,
              },
              date: new Date(documentSnapshot.data().date.seconds * 1000),
              description: documentSnapshot.data().description,
              imageUrl: "https://picsum.photos/700",
              title: documentSnapshot.data().title,
            });
          });
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            console.error(
              `Error with fetching ${FIRESTORE_COLLECTION}, details: `,
              error
            );
          }
        });

      // TODO: When PredictHQ will be unblocked order the whole code and ideally 'allSettled' (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) should've been used.
      Promise.race([promiseUsersEvents, promisePredictHqEvents]).then(() => {
        const finalEvents = [...predictHqEvents, ...usersEvents, ...EVENTS];
        dispatch({ type: SET_EVENTS, events: finalEvents });
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Error with executing try block for fetching events, details:",
          error
        );
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
