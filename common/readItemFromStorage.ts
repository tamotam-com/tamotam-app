import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import { Event } from "../interfaces/event";

export const readItemFromStorage: () => Promise<Event[] | null> = async () => {
  let eventsParsed: Event[] = [];

  try {
    const eventsInJSONString: any = await AsyncStorage.getItem("EVENTS_ASYNC_STORAGE");
    eventsParsed = JSON.parse(eventsInJSONString);

    analytics().logEvent("custom_log", {
      description: "--- Analytics: common -> readItemFromStorage -> try, eventsInJSONString: " + eventsInJSONString,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      Alert.alert(
        "Error ❌",
        "Problem with reading events from a local device.",
        [{ text: "Okay" }]
      );

      analytics().logEvent("custom_log", {
        description: "--- Analytics: common -> readItemFromStorage -> catch, error: " + error,
      });
      crashlytics().recordError(error);
    }
  } finally {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: common -> readItemFromStorage -> finally",
    });
  }

  return eventsParsed ? eventsParsed : [];
};

export default readItemFromStorage;
