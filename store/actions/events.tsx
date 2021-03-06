import * as Localization from "expo-localization";
import analytics from "@react-native-firebase/analytics";
import axios, { AxiosResponse } from "axios";
import crashlytics from "@react-native-firebase/crashlytics";
import firestore from "@react-native-firebase/firestore";
import writeItemToStorage from "../../common/writeItemToStorage";
import { deleteSavedEvent, fetchSavedEvents, insertSavedEvent } from "../../helpers/sqlite_db";
import { Alert } from "react-native";
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

export const fetchEvents: () => (dispatch: any) => void = () => {
  return async (dispatch: any) => {
    let bikeRegEvents: Event[] = [];
    let eventsFinal: Event[] = [];
    let predictHqEvents: Event[] = [];
    let runRegEvents: Event[] = [];
    let seatGeekEvents: Event[] = [];
    let skiRegEvents: Event[] = [];
    let ticketmasterEvents: any[] = [];
    let triRegEvents: Event[] = [];
    let usersEvents: Event[] = [];

    let promiseBikeRegEvents: void | AxiosResponse<any, any> | any;
    let promisePredictHqEvents: void | AxiosResponse<any, any> | any;
    let promiseSeatGeekEvents: void | AxiosResponse<any, any> | any;
    let promiseSkiRegEvents: void | AxiosResponse<any, any> | any;
    let promiseRunRegEvents: void | AxiosResponse<any, any> | any;
    let promiseTicketmasterEvents: void | AxiosResponse<any, any> | any;
    let promiseTriRegEvents: void | AxiosResponse<any, any> | any;
    let promiseUsersEvents: void;

    try {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> fetchEvents -> try",
      });

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
                date: new Date(dateInMilliseconds),
                description: response.data.MatchingEvents[EventId].PresentedBy,
                imageUrl: require("../../assets/images/no-image.jpeg"),
                isUserEvent: false,
                title: response.data.MatchingEvents[EventId].EventName,
              });
            }
            analytics().logEvent("custom_log", {
              description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseBikeRegEvents -> try, bikeRegEvents: " + bikeRegEvents,
            });
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              analytics().logEvent("custom_log", {
                description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseBikeRegEvents -> catch, error: " + error,
              });
              crashlytics().recordError(error);
            }
          }).finally(() => {
            analytics().logEvent("custom_log", {
              description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseBikeRegEvents -> finally",
            });
          });
      }
      dispatch({
        type: SET_EVENTS,
        events: bikeRegEvents,
      });

      // TODO: Delete PredictHQ after temporarily access will be granted, because it's too expensive after that.
      promisePredictHqEvents =
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
            analytics().logEvent("custom_log", {
              description: "--- Analytics: store -> actions -> events -> fetchEvents -> promisePredictHqEvents -> catch, error: " + error,
            });
            crashlytics().recordError(error);
          }
        }).finally(() => {
          analytics().logEvent("custom_log", {
            description: "--- Analytics: store -> actions -> events -> fetchEvents -> promisePredictHqEvents -> finally",
          });
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

      for (let page = 0; page < SEATGEEK_NUMBER_OF_PAGES; page++) {
        promiseSeatGeekEvents = await axios({
          method: "GET",
          url: `https://api.seatgeek.com/2/events?client_id=${SEATGEEK_CLIENT_ID}&client_secret=${SEATGEEK_SECRET}?per_page=${SEATGEEK_PAGE_SIZE}`,
        })
          .then((response: AxiosResponse<any, any>) => {
            for (const id in response.data.events) {
              // console.log(id); // TODO: Debug what kind of ID is returned when access will be unblocked.
              seatGeekEvents.push({
                id,
                coordinate: {
                  latitude: response.data.events[id].venue.location.lat,
                  longitude: response.data.events[id].venue.location.lon,
                },
                date: new Date(response.data.events[id].datetime_local),
                description: response.data.events[id].description,
                imageUrl: response.data.events[id].performers[0].image,
                isUserEvent: false,
                title: response.data.events[id].title,
              });
            }
            analytics().logEvent("custom_log", {
              description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseSeatGeekEvents -> try, seatGeekEvents: " + seatGeekEvents,
            });
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              analytics().logEvent("custom_log", {
                description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseSeatGeekEvents -> catch, error: " + error,
              });
              crashlytics().recordError(error);
            }
          }).finally(() => {
            analytics().logEvent("custom_log", {
              description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseSeatGeekEvents -> finally",
            });
          });
        // console.log(seatGeekEvents.length); // TODO: Debug what is returned when access will be unblocked.
      }

      promiseSkiRegEvents =
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
                date: new Date(dateInMilliseconds),
                description: response.data.MatchingEvents[EventId].PresentedBy,
                imageUrl: require("../../assets/images/no-image.jpeg"),
                isUserEvent: false,
                title: response.data.MatchingEvents[EventId].EventName,
              });
            }
            analytics().logEvent("custom_log", {
              description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseSkiRegEvents -> try, skiRegEvents: " + skiRegEvents,
            });
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              analytics().logEvent("custom_log", {
                description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseSkiRegEvents -> catch, error: " + error,
              });
              crashlytics().recordError(error);
            }
          }).finally(() => {
            dispatch({
              type: SET_EVENTS,
              events: skiRegEvents,
            });
            analytics().logEvent("custom_log", {
              description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseSkiRegEvents -> finally",
            });
          });

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
                date: new Date(dateInMilliseconds),
                description: response.data.MatchingEvents[EventId].PresentedBy,
                imageUrl: require("../../assets/images/no-image.jpeg"),
                isUserEvent: false,
                title: response.data.MatchingEvents[EventId].EventName,
              });
            }
            analytics().logEvent("custom_log", {
              description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseRunRegEvents -> try, runRegEvents: " + runRegEvents,
            });
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              analytics().logEvent("custom_log", {
                description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseRunRegEvents -> catch, error: " + error,
              });
              crashlytics().recordError(error);
            }
          }).finally(() => {
            analytics().logEvent("custom_log", {
              description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseRunRegEvents -> finally",
            });
          });
      }
      dispatch({
        type: SET_EVENTS,
        events: runRegEvents,
      });

      const myArray: string[] = ['AT', 'AU', 'BE', 'CA', 'CH', 'CZ', 'DE', 'DK', 'ES', 'FI', 'GB', 'IE', 'LU', 'MX', 'NO', 'NL', 'PL', 'PT', 'SE', 'US'];
      for (const country of myArray) {
        for (let page = 0; page < TICKETMASTER_NUMBER_OF_PAGES; page++) {
          promiseTicketmasterEvents = await axios({
            method: "GET",
            url: `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=${country}&apikey=${TICKETMASTER_API_KEY}&size=${TICKETMASTER_SIZE}&page=${page}`,
          })
            .then((response: AxiosResponse<any, any>) => {
              for (const id in response.data._embedded.events) {
                // "JSON.stringify" is needed to achieve unique Set of Objects.
                ticketmasterEvents.push(JSON.stringify({
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
                    response.data._embedded.events[id].dates.start.dateTime
                  ),
                  description: response.data._embedded.events[id]._embedded.venues[0].city.name,
                  imageUrl: response.data._embedded.events[id].images[0].url,
                  isUserEvent: false,
                  title: response.data._embedded.events[id].name,
                }));
              }
              analytics().logEvent("custom_log", {
                description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseTicketmasterEvents -> try, ticketmasterEvents: " + ticketmasterEvents,
              });
            })
            .catch((error: unknown) => {
              if (error instanceof Error) {
                analytics().logEvent("custom_log", {
                  description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseTicketmasterEvents -> catch, error: " + error,
                });
                crashlytics().recordError(error);
              }
            }).finally(() => {
              analytics().logEvent("custom_log", {
                description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseTicketmasterEvents -> finally",
              });
            });
        }
      }
      const ticketmasterEventsSet: Set<any> = new Set(ticketmasterEvents)
      const list: any[] = Array.from(ticketmasterEventsSet);

      ticketmasterEvents = [];
      list.forEach((eventStringified: string) => {
        JSON.parse(eventStringified);
        ticketmasterEvents.push(JSON.parse(eventStringified));
      });

      ticketmasterEvents.forEach((eventStringified: any, index: number) => {
        ticketmasterEvents[index].id = Number(eventStringified.id);
        ticketmasterEvents[index].coordinate = {
          latitude: Number(eventStringified.coordinate.latitude),
          longitude: Number(eventStringified.coordinate.longitude),
        };
        ticketmasterEvents[index].date = new Date(eventStringified.date);
        ticketmasterEvents[index].description = eventStringified.description;
        ticketmasterEvents[index].imageUrl = eventStringified.imageUrl;
        ticketmasterEvents[index].title = eventStringified.title;
      });
      dispatch({
        type: SET_EVENTS,
        events: ticketmasterEvents,
      });

      promiseTriRegEvents =
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
                date: new Date(dateInMilliseconds),
                description: response.data.MatchingEvents[EventId].PresentedBy,
                imageUrl: require("../../assets/images/no-image.jpeg"),
                isUserEvent: false,
                title: response.data.MatchingEvents[EventId].EventName,
              });
            }
            analytics().logEvent("custom_log", {
              description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseTriRegEvents -> try, triRegEvents: " + triRegEvents,
            });
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              analytics().logEvent("custom_log", {
                description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseTriRegEvents -> catch, error: " + error,
              });
              crashlytics().recordError(error);
            }
          }).finally(() => {
            dispatch({
              type: SET_EVENTS,
              events: triRegEvents,
            });
            analytics().logEvent("custom_log", {
              description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseTriRegEvents -> finally",
            });
          });

      promiseUsersEvents = await firestore()
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
              isUserEvent: documentSnapshot.data().isUserEvent,
              title: documentSnapshot.data().title,
            });
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseUsersEvents -> then, usersEvents: " + usersEvents,
          });
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            analytics().logEvent("custom_log", {
              description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseUsersEvents -> catch, error: " + error,
            });
            crashlytics().recordError(error);
          }
        }).finally(() => {
          dispatch({
            type: SET_EVENTS,
            events: usersEvents,
          });
          analytics().logEvent("custom_log", {
            description: "--- Analytics: store -> actions -> events -> fetchEvents -> promiseUsersEvents -> finally",
          });
        });
    } catch (error: unknown) {
      if (error instanceof Error) {
        analytics().logEvent("custom_log", {
          description: "--- Analytics: store -> actions -> events -> fetchEvents -> catch, error: " + error,
        });
        crashlytics().recordError(error);
      }
    } finally {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> fetchEvents -> finally",
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
        eventsFinal = [
          ...bikeRegEvents,
          ...predictHqEvents,
          ...runRegEvents,
          ...seatGeekEvents,
          ...skiRegEvents,
          ...ticketmasterEvents,
          ...triRegEvents,
          ...usersEvents,
        ];
        analytics().logEvent("custom_log", {
          description: "--- Analytics: store -> actions -> events -> fetchEvents -> finally -> Promise.race([...]) -> then, eventsFinal: " + eventsFinal,
        });
        writeItemToStorage(eventsFinal);
      }).catch((error: unknown) => {
        if (error instanceof Error) {
          analytics().logEvent("custom_log", {
            description: "--- Analytics: store -> actions -> events -> fetchEvents -> finally -> Promise.race([...]) -> catch, error: " + error,
          });
          crashlytics().recordError(error);
        }
      }).finally(() => {
        analytics().logEvent("custom_log", {
          description: "--- Analytics: store -> actions -> events -> fetchEvents -> finally -> Promise.race([...]) -> finally",
        });
      });
    }
  };
};

export const addEvent = (event: Event) => {
  return async (
    dispatch: (arg0: {
      type: string;
      eventData: {
        id: number | string;
        coordinate: Coordinate;
        date: Date;
        description: string;
        imageUrl: string;
        isUserEvent: boolean;
        title: string;
      };
    }) => void
  ) => {
    try {
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
          isUserEvent: event.isUserEvent,
          title: event.title,
        },
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> addEvent -> try, event: " + event,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ???",
          "Adding an event has failed.",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: store -> actions -> events -> addEvent -> catch, error: " + error,
        });
        crashlytics().recordError(error);
      }
    } finally {
      Alert.alert(
        "Event added ???",
        "You have successfully added this event.",
        [{ text: "Okay" }]
      );
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> addEvent -> finally",
      });
    }
  };
};

export const deleteEvent = (event: Event) => {
  return async (
    dispatch: (arg0: {
      type: string;
      eventData: {
        id: number | string;
        coordinate: Coordinate;
        date: Date;
        description: string;
        imageUrl: string;
        isUserEvent: boolean;
        title: string;
      };
    }) => void
  ) => {
    try {
      const dbResult: any = await deleteSavedEvent(event.id);

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
          isUserEvent: event.isUserEvent,
          title: event.title,
        },
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> deleteEvent -> try, dbResult: " + dbResult,
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> deleteEvent -> try, event: " + event,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ???",
          "Deleting a saved event has failed.",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: store -> actions -> events -> deleteEvent -> catch, error: " + error,
        });
        crashlytics().recordError(error);
      }
    } finally {
      Alert.alert(
        "Saved event deleted ???",
        "You have successfully deleted this saved event, and it will no longer be visible.",
        [{ text: "Okay" }]
      );
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> deleteEvent -> finally",
      });
    }
  };
};

export const fetchUsersSavedEvents = () => {
  return async (
    dispatch: (arg0: { savedEvents: Event[]; type: string }) => void
  ) => {
    try {
      const dbResult: any = await fetchSavedEvents();

      dispatch({
        savedEvents: dbResult.rows._array,
        type: SET_SAVED_EVENTS
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> fetchUsersSavedEvents -> try, dbResult: " + dbResult,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ???",
          "TamoTam couldn't fetch your saved events.",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: store -> actions -> events -> fetchUsersSavedEvents -> catch, error: " + error,
        });
        crashlytics().recordError(error);
      }
    } finally {
      Alert.alert(
        "Saved events loaded ???",
        "These are stored on your local device as long as you won't explicitly clear the data or uninstall TamoTam.",
        [{ text: "Okay" }]
      );
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> fetchUsersSavedEvents -> finally",
      });
    }
  };
};

export const readItemFromStorage: (eventsFromAsyncStorage: Event[]) => void = (eventsFromAsyncStorage: Event[]) => {
  return async (
    dispatch: (arg0: { events: Event[]; type: string }) => void
  ) => {
    try {
      dispatch({
        type: SET_EVENTS,
        events: eventsFromAsyncStorage,
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> readItemFromStorage -> try, eventsFromAsyncStorage: " + eventsFromAsyncStorage,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ???",
          "Problem with loading events from a local device to avoid a big load during the next application launch.",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: store -> actions -> events -> readItemFromStorage -> catch, error: " + error,
        });
        crashlytics().recordError(error);
      }
    } finally {
      Alert.alert(
        "Events loaded ???",
        "These are stored for a week on your local device as long as you won't explicitly clear the data or uninstall TamoTam.",
        [{ text: "Okay" }]
      );
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> readItemFromStorage -> finally",
      });
    }
  }
};

export const saveEvent = (event: Event) => {
  return async (
    dispatch: (arg0: {
      type: string;
      eventData: {
        id: number | string;
        coordinate: Coordinate;
        date: Date;
        description: string;
        imageUrl: string;
        isUserEvent: boolean;
        title: string;
      };
    }) => void
  ) => {
    try {
      const dbResult: any = await insertSavedEvent(
        event.coordinate,
        event.date,
        event.description,
        event.imageUrl,
        event.isUserEvent,
        event.title
      );

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
          isUserEvent: event.isUserEvent,
          title: event.title,
        },
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> saveEvent -> try, dbResult: " + dbResult,
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> saveEvent -> try, event: " + event,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ???",
          "TamoTam couldn't save your event.",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: store -> actions -> events -> saveEvent -> catch, error: " + error,
        });
        crashlytics().recordError(error);
      }
    } finally {
      Alert.alert(
        "Event saved ???",
        "It will be visible in your saved events till you don't delete it.",
        [{ text: "Okay" }]
      );
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> saveEvent -> finally",
      });
    }
  };
};

export const updateEvent = (event: Event) => {
  return async (
    dispatch: (arg0: {
      type: string;
      eventData: {
        id: number | string;
        coordinate: Coordinate;
        date: Date;
        description: string;
        imageUrl: string;
        isUserEvent: boolean;
        title: string;
      };
    }) => void
  ) => {
    try {
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
          isUserEvent: event.isUserEvent,
          title: event.title,
        },
      });

      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> updateEvent -> try, event: " + event,
      });
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ???",
          "TamoTam couldn't update this event.",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: store -> actions -> events -> updateEvent -> catch, error: " + error,
        });
        crashlytics().recordError(error);
      }
    } finally {
      Alert.alert(
        "Event updated ???",
        "It will be visible in your saved events till you don't delete it.",
        [{ text: "Okay" }]
      );
    }
  };
};
