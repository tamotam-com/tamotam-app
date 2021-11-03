/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import EditEventScreen from "../screens/EditEventScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import NewEventScreen from "../screens/NewEventScreen";

import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList } from "../types";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "boiling-demo" },
          title: "Oops!",
        }}
      />
      <Stack.Screen
        name="EditEvent"
        component={EditEventScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "boiling-demo" },
          title: "Edit Event",
        }}
      />
      <Stack.Screen
        name="NewEvent"
        component={NewEventScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "boiling-demo" },
          title: "New Event",
        }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "boiling-demo" },
          title: "Event Detail",
        }}
      />
    </Stack.Navigator>
  );
}
