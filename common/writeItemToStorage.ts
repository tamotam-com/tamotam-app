import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import { Event } from "../interfaces/event";

export const writeItemToStorage: (eventsToAsyncStorage: Event[]) => Promise<void> = async (eventsToAsyncStorage: Event[]) => {
  const eventsInJSONString: string = JSON.stringify(eventsToAsyncStorage);

  try {
    await AsyncStorage.setItem("EVENTS_ASYNC_STORAGE", eventsInJSONString);
  } catch (error) {
    if (error instanceof Error) {
      console.error('useAsyncStorage getItem error:', error);
    }
  } finally {
    Alert.alert(
      "Events loaded ✅",
      "Once a week, TamoTam will make such a big load of external events.",
      [{ text: "Okay" }]
    );
  }
};

export default writeItemToStorage;
