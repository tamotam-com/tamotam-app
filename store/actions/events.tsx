import * as FileSystem from "expo-file-system";
import * as Localization from "expo-localization";
import axios, { AxiosResponse } from "axios";
import firestore from "@react-native-firebase/firestore";
import { fetchSavedEvents, insertSavedEvent } from "../../helpers/db";
import { Coordinate } from "../../interfaces/coordinate";
import { Event } from "../../interfaces/event";
import {
  BIKEREG_NUMBER_OF_PAGES,
  FIRESTORE_COLLECTION,
  PREDICTHQ_ACCESS_TOKEN,
  PREDICTHQ_CATEGORIES,
  PREDICTHQ_LIMIT,
  RUNREG_NUMBER_OF_PAGES,
  SEATGEEK_CLIENT_ID,
  SEATGEEK_PAGE_SIZE,
  SEATGEEK_NUMBER_OF_PAGES,
  SEATGEEK_SECRET,
  TICKETMASTER_API_KEY,
  TICKETMASTER_NUMBER_OF_PAGES,
  TICKETMASTER_SIZE,
  // @ts-ignore
} from "@env";

export const ADD_EVENT = "ADD_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";
export const SAVE_EVENT = "SAVE_EVENT";
export const SET_EVENTS = "SET_EVENTS";
export const SET_SAVED_EVENTS = "SET_SAVED_EVENTS";
export const UPDATE_EVENT = "UPDATE_EVENT";

export const fetchEvents = () => {
  return async (dispatch: any) => {
    try {
      const bikeRegEvents: any[] = [];
      const predictHqEvents: any[] = [];
      const runRegEvents: any[] = [];
      const seatGeekEvents: any[] = [];
      const skiRegEvents: any[] = [];
      const ticketmasterEvents: any[] = [];
      const triRegEvents: any[] = [];
      const usersEvents: any[] = [];

      let promiseBikeRegEvents: void | AxiosResponse<any, any> | any;
      for (let page = 1; page < BIKEREG_NUMBER_OF_PAGES; page++) {
        promiseBikeRegEvents = await axios({
          method: "GET",
          url: `https://www.bikereg.com/api/search?startpage=${page}`,
        })
          .then((response: AxiosResponse<any, any>) => {
            for (const EventId in response.data.MatchingEvents) {
              const arrayByDashSignDivider =
                response.data.MatchingEvents[EventId].EventDate.match(/\d+/g);
              const checkForDash = /-/.test(
                response.data.MatchingEvents[EventId].EventDate
              )
                ? -1
                : +1;
              const dateInMilliseconds =
                +arrayByDashSignDivider[0] +
                checkForDash *
                  (arrayByDashSignDivider[1].slice(0, 2) * 3.6e6 +
                    arrayByDashSignDivider[1].slice(-2) * 6e4);

              bikeRegEvents.push({
                id: EventId, // TODO: This EventId isn't fully correct as it goes 0, 1, 2, ... instead of the EventID fetched from the API.
                coordinate: {
                  latitude: response.data.MatchingEvents[EventId].Latitude,
                  longitude: response.data.MatchingEvents[EventId].Longitude,
                },
                date: new Date(dateInMilliseconds), // TODO: Double check the time.
                description: response.data.MatchingEvents[EventId].PresentedBy,
                imageUrl: require("../../assets/images/no-image.jpeg"),
                title: response.data.MatchingEvents[EventId].EventName,
              });
            }
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              console.error(
                "Error with fetching BikeReg events, details: ",
                error
              );
            }
          });
      }

      // TODO: Delete PredictHQ after temporarily access will be granted, because it's too expensive after that.
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

      let promiseSeatGeekEvents: void | AxiosResponse<any, any> | any;
      for (let page = 0; page < SEATGEEK_NUMBER_OF_PAGES; page++) {
        promiseSeatGeekEvents = await axios({
          method: "GET",
          url: `https://api.seatgeek.com/2/events?client_id=${SEATGEEK_CLIENT_ID}&client_secret=${SEATGEEK_SECRET}?per_page=${SEATGEEK_PAGE_SIZE}`,
        })
          .then((response: AxiosResponse<any, any>) => {
            for (const id in response.data.events) {
              console.log(id);
              seatGeekEvents.push({
                id,
                coordinate: {
                  latitude: response.data.events[id].venue.location.lat,
                  longitude: response.data.events[id].venue.location.lon,
                },
                date: new Date(response.data.events[id].datetime_local),
                description: response.data.events[id].description,
                imageUrl: response.data.events[id].performers[0].image,
                title: response.data.events[id].title,
              });
            }
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              console.error(
                "Error with fetching SeatGeek events, details: ",
                error
              );
            }
          });
        console.log(seatGeekEvents.length);
      }

      const promiseSkiRegEvents: void | AxiosResponse<any, any> | any =
        await axios({
          method: "GET",
          url: "https://www.skireg.com/api/search",
        })
          .then((response: AxiosResponse<any, any>) => {
            for (const EventId in response.data.MatchingEvents) {
              const arrayByDashSignDivider =
                response.data.MatchingEvents[EventId].EventDate.match(/\d+/g);
              const checkForDash = /-/.test(
                response.data.MatchingEvents[EventId].EventDate
              )
                ? -1
                : +1;
              const dateInMilliseconds =
                +arrayByDashSignDivider[0] +
                checkForDash *
                  (arrayByDashSignDivider[1].slice(0, 2) * 3.6e6 +
                    arrayByDashSignDivider[1].slice(-2) * 6e4);

              skiRegEvents.push({
                id: EventId, // TODO: This EventId isn't fully correct as it goes 0, 1, 2, ... instead of the EventID fetched from the API.
                coordinate: {
                  latitude: response.data.MatchingEvents[EventId].Latitude,
                  longitude: response.data.MatchingEvents[EventId].Longitude,
                },
                date: new Date(dateInMilliseconds), // TODO: Double check the time.
                description: response.data.MatchingEvents[EventId].PresentedBy,
                imageUrl: require("../../assets/images/no-image.jpeg"),
                title: response.data.MatchingEvents[EventId].EventName,
              });
            }
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              console.error(
                "Error with fetching SkiReg events, details: ",
                error
              );
            }
          });

      let promiseRunRegEvents: void | AxiosResponse<any, any> | any;
      for (let page = 1; page < RUNREG_NUMBER_OF_PAGES; page++) {
        promiseRunRegEvents = await axios({
          method: "GET",
          url: `https://www.runreg.com/api/search?startpage=${page}`,
        })
          .then((response: AxiosResponse<any, any>) => {
            for (const EventId in response.data.MatchingEvents) {
              const arrayByDashSignDivider =
                response.data.MatchingEvents[EventId].EventDate.match(/\d+/g);
              const checkForDash = /-/.test(
                response.data.MatchingEvents[EventId].EventDate
              )
                ? -1
                : +1;
              const dateInMilliseconds =
                +arrayByDashSignDivider[0] +
                checkForDash *
                  (arrayByDashSignDivider[1].slice(0, 2) * 3.6e6 +
                    arrayByDashSignDivider[1].slice(-2) * 6e4);

              runRegEvents.push({
                id: EventId, // TODO: This EventId isn't fully correct as it goes 0, 1, 2, ... instead of the EventID fetched from the API.
                coordinate: {
                  latitude: response.data.MatchingEvents[EventId].Latitude,
                  longitude: response.data.MatchingEvents[EventId].Longitude,
                },
                date: new Date(dateInMilliseconds), // TODO: Double check the time.
                description: response.data.MatchingEvents[EventId].PresentedBy,
                imageUrl: require("../../assets/images/no-image.jpeg"),
                title: response.data.MatchingEvents[EventId].EventName,
              });
            }
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              console.error(
                "Error with fetching RunReg events, details: ",
                error
              );
            }
          });
      }

      let promiseTicketmasterEvents: void | AxiosResponse<any, any> | any;
      for (let page = 0; page < TICKETMASTER_NUMBER_OF_PAGES; page++) {
        promiseTicketmasterEvents = await axios({
          method: "GET",
          url: `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=DE&apikey=${TICKETMASTER_API_KEY}&size=${TICKETMASTER_SIZE}`,
        })
          .then((response: AxiosResponse<any, any>) => {
            for (const id in response.data._embedded.events) {
              ticketmasterEvents.push({
                id,
                coordinate: {
                  latitude:
                    response.data._embedded.events[id]._embedded.venues[0]
                      .location.latitude,
                  longitude:
                    response.data._embedded.events[id]._embedded.venues[0]
                      .location.longitude,
                },
                date: new Date(
                  response.data._embedded.events[id].dates.start.localDate
                ),
                description:
                  response.data._embedded.events[id]._embedded.venues[0].name,
                imageUrl: response.data._embedded.events[id].images[0].url,
                title: response.data._embedded.events[id].name,
              });
            }
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              console.error(
                "Error with fetching Ticketmaster events, details: ",
                error
              );
            }
          });
      }

      const promiseTriRegEvents: void | AxiosResponse<any, any> | any =
        await axios({
          method: "GET",
          url: "https://www.trireg.com/api/search",
        })
          .then((response: AxiosResponse<any, any>) => {
            // console.log(response.data.MatchingEvents);
            for (const EventId in response.data.MatchingEvents) {
              const arrayByDashSignDivider =
                response.data.MatchingEvents[EventId].EventDate.match(/\d+/g);
              const checkForDash = /-/.test(
                response.data.MatchingEvents[EventId].EventDate
              )
                ? -1
                : +1;
              const dateInMilliseconds =
                +arrayByDashSignDivider[0] +
                checkForDash *
                  (arrayByDashSignDivider[1].slice(0, 2) * 3.6e6 +
                    arrayByDashSignDivider[1].slice(-2) * 6e4);

              triRegEvents.push({
                id: EventId, // TODO: This EventId isn't fully correct as it goes 0, 1, 2, ... instead of the EventID fetched from the API.
                coordinate: {
                  // TODO: That's the only case such a check is required. Let's see if it shouldn't be done on the MapScreen side.
                  latitude: response.data.MatchingEvents[EventId].Latitude
                    ? response.data.MatchingEvents[EventId].Latitude
                    : 32.2332,
                  longitude: response.data.MatchingEvents[EventId].Longitude
                    ? response.data.MatchingEvents[EventId].Longitude
                    : 5.213,
                },
                date: new Date(dateInMilliseconds), // TODO: Double check the time.
                description: response.data.MatchingEvents[EventId].PresentedBy,
                imageUrl: require("../../assets/images/no-image.jpeg"),
                title: response.data.MatchingEvents[EventId].EventName,
              });
            }
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              console.error(
                "Error with fetching TriReg events, details: ",
                error
              );
            }
          });

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
              imageUrl: require("../../assets/images/no-image.jpeg"),
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

      Promise.race([
        promiseBikeRegEvents,
        promisePredictHqEvents,
        promiseRunRegEvents,
        promiseSeatGeekEvents,
        promiseSkiRegEvents,
        promiseTicketmasterEvents,
        promiseTriRegEvents,
        promiseUsersEvents,
      ]).then(() => {
        const finalEvents = [
          ...bikeRegEvents,
          ...predictHqEvents,
          ...runRegEvents,
          ...seatGeekEvents,
          ...skiRegEvents,
          ...ticketmasterEvents,
          ...triRegEvents,
          ...usersEvents,
        ];
        dispatch({
          type: SET_EVENTS,
          events: finalEvents,
          savedEvents: [],
        });
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

export const loadSavedEvents = () => {
  return async (
    dispatch: (arg0: { savedEvents: any; type: string }) => void
  ) => {
    try {
      const dbResult = await fetchSavedEvents();
      console.log(dbResult);
      dispatch({ savedEvents: dbResult.rows._array, type: SET_SAVED_EVENTS });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        throw error;
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
    const fileName = event.imageUrl.split("/").pop();
    // @ts-ignore
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.moveAsync({
        from: event.imageUrl,
        to: newPath,
      });
      const dbResult = await insertSavedEvent(
        event.coordinate,
        event.date,
        event.description,
        newPath,
        event.title
      );
      console.log(dbResult);

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
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        throw error;
      }
    }
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
