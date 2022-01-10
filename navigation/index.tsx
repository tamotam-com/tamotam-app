import * as React from "react";
import BottomTabNavigator from "./BottomTabNavigator";
import EditEventScreen from "../screens/EditEventScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import LinkingConfiguration from "./LinkingConfiguration";
import NewEventScreen from "../screens/NewEventScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { ColorSchemeName } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { RootStackParamList } from "../types";

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

const Stack = createStackNavigator<RootStackParamList>();
function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={BottomTabNavigator}
        name="Root"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        component={NotFoundScreen}
        name="NotFound"
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "boiling-demo" },
          title: "Oops!",
        }}
      />
      <Stack.Screen
        component={EditEventScreen}
        name="EditEvent"
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "boiling-demo" },
          title: "Edit Event",
        }}
      />
      <Stack.Screen
        component={NewEventScreen}
        name="NewEvent"
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "boiling-demo" },
          title: "New Event",
        }}
      />
      <Stack.Screen
        component={EventDetailScreen}
        name="EventDetail"
        options={{
          headerShown: true,
          headerTitleStyle: { fontFamily: "boiling-demo" },
          title: "Event Detail",
        }}
      />
    </Stack.Navigator>
  );
}
