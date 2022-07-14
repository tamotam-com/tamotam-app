import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import { Event } from "../interfaces/event";

export const writeItemToStorage: (eventsToAsyncStorage: Event[]) => Promise<void> = async (eventsToAsyncStorage: Event[]) => {
  const eventsInJSONString: string = JSON.stringify(eventsToAsyncStorage);

  try {
    await AsyncStorage.setItem("EVENTS_ASYNC_STORAGE", eventsInJSONString);

    analytics().logEvent("custom_log", {
      description: "--- Analytics: common -> writeItemToStorage -> try, eventsInJSONString: " + eventsInJSONString,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      Alert.alert(
        "Error ❌",
        "Problem with saving events on a local device to avoid a big load during next application launch.",
        [{ text: "Okay" }]
      );

      analytics().logEvent("custom_log", {
        description: "--- Analytics: common -> writeItemToStorage -> catch, error: " + error,
      });
      crashlytics().recordError(error);
    }
  } finally {
    Alert.alert(
      "Events locally saved ✅",
      "Once a week, TamoTam will make such a big load of external events.",
      [{ text: "Okay" }]
    );
    analytics().logEvent("custom_log", {
      description: "--- Analytics: common -> writeItemToStorage -> finally",
    });
  }
};

export default writeItemToStorage;
