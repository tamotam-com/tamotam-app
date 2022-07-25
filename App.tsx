import "react-native-gesture-handler";
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import eventsReducer from "./store/reducers/events";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Colors from "./constants/Colors";
import React, { useEffect } from "react";
import Navigation from "./navigation";
import ReduxThunk from "redux-thunk";
import StyledText from "./components/StyledText";
import { applyMiddleware, createStore, combineReducers } from "redux";
import { init } from "./helpers/sqlite_db";
import { useNetInfo, NetInfoState } from "@react-native-community/netinfo";
import { Alert, ColorSchemeName, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";

init()
  .then(() => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: App -> init -> then",
    });
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: App -> init -> catch, error: " + error,
      });
      crashlytics().recordError(error);
    }
  }).finally(() => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: App -> init -> finally",
    });
  });

const rootReducer = combineReducers({
  events: eventsReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const colorScheme: ColorSchemeName = useColorScheme();
  const internetState: NetInfoState = useNetInfo();
  const isLoadingComplete: boolean = useCachedResources();

  useEffect(() => {
    if (internetState.isConnected === false) {
      Alert.alert(
        "No Internet! ❌",
        "Sorry, we need an Internet connection for TamoTam to run correctly.",
        [{ text: "Okay" }]
      );
    }
    analytics().logEvent("custom_log", {
      description: "--- Analytics: App -> useEffect[internetState.isConnected]: " + internetState.isConnected,
    });
  }, [internetState.isConnected]);

  if (!isLoadingComplete) {
    return null;
  } else {
    if (internetState.isConnected === false) {
      return (
        <View style={[styles.centered, {
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        }]}>
          <StyledText style={[styles.title, {
            color:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
          }]}>
            Please turn on the Internet to use TamoTam.
          </StyledText>
        </View>
      );
    }

    return (
      <StoreProvider store={store}>
        <PaperProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </PaperProvider>
      </StoreProvider>
    );
  }
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
