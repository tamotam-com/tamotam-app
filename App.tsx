import "react-native-gesture-handler";
import eventsReducer from "./store/reducers/events";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import React from "react";
import Navigation from "./navigation";
import ReduxThunk from "redux-thunk";
import { applyMiddleware, createStore, combineReducers } from "redux";
import { init } from "./helpers/db";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";

init()
  .then(() => {
    console.log("Initialized database was successful.");
  })
  .catch((error) => {
    if (error instanceof Error) {
      console.log("Initializing database has failed.");
      console.error(error);
    }
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
