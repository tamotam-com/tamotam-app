import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { applyMiddleware, createStore, combineReducers } from "redux";
import eventsReducer from "./store/reducers/events";
import ReduxThunk from "redux-thunk";

const rootReducer = combineReducers({
  events: eventsReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <StoreProvider store={store}>
        <PaperProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar /></PaperProvider>
        </StoreProvider>
    );
  }
}
