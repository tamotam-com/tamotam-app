import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import { deleteSavedEvent, fetchSavedEvents, insertSavedEvent } from "../../helpers/sqlite_db";
import { Alert } from "react-native";
import { Event } from "../../interfaces/event";

export const ADD_EVENT = "ADD_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";
export const SAVE_EVENT = "SAVE_EVENT";
export const SET_EVENTS = "SET_EVENTS";
export const SET_SAVED_EVENTS = "SET_SAVED_EVENTS";
export const UPDATE_EVENT = "UPDATE_EVENT";

export const addEvent = (event: Event) => {
  return async (
    dispatch: (arg0: {
      type: string;
      eventData: {
        id: number | string;
        date: Date;
        description: string;
        imageUrl: string;
        isUserEvent: boolean;
        latitude: number;
        longitude: number;
        title: string;
      };
    }) => void
  ) => {
    try {
      dispatch({
        type: ADD_EVENT,
        eventData: {
          id: event.id,
          date: event.date,
          description: event.description,
          imageUrl: event.imageUrl,
          isUserEvent: event.isUserEvent,
          latitude: event.latitude,
          longitude: event.longitude,
          title: event.title,
        },
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: store -> actions -> events -> addEvent -> try, event: " + event,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ❌",
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
        "Event added ✅",
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
        date: Date;
        description: string;
        firestoreDocumentId?: string;
        imageUrl: string;
        isUserEvent: boolean;
        latitude: number;
        longitude: number;
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
          date: event.date,
          description: event.description,
          firestoreDocumentId: event.firestoreDocumentId,
          imageUrl: event.imageUrl,
          isUserEvent: event.isUserEvent,
          latitude: event.latitude,
          longitude: event.longitude,
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
          "Error ❌",
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
        "Saved event deleted ✅",
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
          "Error ❌",
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
        "Saved events loaded ✅",
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
          "Error ❌",
          "Problem with loading events from a local device to avoid a big load during the next application launch.",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: store -> actions -> events -> readItemFromStorage -> catch, error: " + error,
        });
        crashlytics().recordError(error);
      }
    } finally {
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
        date: Date;
        description: string;
        firestoreDocumentId?: string;
        imageUrl: string;
        isUserEvent: boolean;
        latitude: number;
        longitude: number;
        title: string;
      };
    }) => void
  ) => {
    try {
      const dbResult: any = await insertSavedEvent(
        event.date,
        event.description,
        event.firestoreDocumentId,
        event.imageUrl,
        event.isUserEvent,
        event.latitude,
        event.longitude,
        event.title
      );

      dispatch({
        type: SAVE_EVENT,
        eventData: {
          id: event.id,
          date: event.date,
          description: event.description,
          firestoreDocumentId: event.firestoreDocumentId,
          imageUrl: event.imageUrl,
          isUserEvent: event.isUserEvent,
          latitude: event.latitude,
          longitude: event.longitude,
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
          "Error ❌",
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
        "Event saved ✅",
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
        date: Date;
        description: string;
        firestoreDocumentId: string;
        imageUrl: string;
        isUserEvent: boolean;
        latitude: number;
        longitude: number;
        title: string;
      };
    }) => void
  ) => {
    try {
      dispatch({
        type: UPDATE_EVENT,
        eventData: {
          id: event.id,
          date: event.date,
          description: event.description,
          firestoreDocumentId: event.firestoreDocumentId!,
          imageUrl: event.imageUrl,
          isUserEvent: event.isUserEvent,
          latitude: event.latitude,
          longitude: event.longitude,
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
          "Error ❌",
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
        "Event updated ✅",
        "It will be visible in your saved events till you don't delete it.",
        [{ text: "Okay" }]
      );
    }
  };
};
