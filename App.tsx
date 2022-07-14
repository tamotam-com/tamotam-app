import "react-native-gesture-handler";
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import eventsReducer from "./store/reducers/events";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import React from "react";
import Navigation from "./navigation";
import ReduxThunk from "redux-thunk";
import { applyMiddleware, createStore, combineReducers } from "redux";
import { init } from "./helpers/sqlite_db";
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
  const colorScheme: "light" | "dark" = useColorScheme(); // TODO: This type might be an interface.
  const isLoadingComplete: boolean = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
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
