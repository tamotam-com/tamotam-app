import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "boiling-demo": require("../assets/fonts/Boiling-BlackDemo.ttf"),
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
        });

        analytics().logEvent("custom_log", {
          description: "--- Analytics: hooks -> useCachedResources -> useEffect[] -> try",
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          Alert.alert(
            "Error ❌",
            "Problem with loading a font.",
            [{ text: "Okay" }]
          );

          analytics().logEvent("custom_log", {
            description: "--- Analytics: hooks -> useCachedResources -> useEffect[] -> catch, error: " + error,
          });
          crashlytics().recordError(error);
        }
      } finally {
        analytics().logEvent("custom_log", {
          description: "--- Analytics: hooks -> useCachedResources -> useEffect[] -> finally",
        });
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
