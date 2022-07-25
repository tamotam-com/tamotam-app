import analytics from "@react-native-firebase/analytics";
import BottomTabNavigator from "./BottomTabNavigator";
import EditEventScreen from "../screens/EditEventScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import LinkingConfiguration from "./LinkingConfiguration";
import NewEventScreen from "../screens/NewEventScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import React, { useRef } from "react";
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
  const routeNameRef: React.MutableRefObject<undefined> = useRef();
  const navigationRef: any = useRef();

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const currentRouteName: any = navigationRef.current.getCurrentRoute().name;
        const previousRouteName: any = routeNameRef.current;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
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
          headerTitle: "Oops!",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "boiling-demo" },
        }}
      />
      <Stack.Screen
        component={EditEventScreen}
        name="EditEvent"
        options={{
          headerShown: true,
          headerTitle: "Edit Event",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "boiling-demo" },
        }}
      />
      <Stack.Screen
        component={NewEventScreen}
        name="NewEvent"
        options={{
          headerShown: true,
          headerTitle: "New Event",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "boiling-demo" },
        }}
      />
      <Stack.Screen
        component={EventDetailScreen}
        name="EventDetail"
        options={{
          headerShown: true,
          headerTitle: "Event Detail",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "boiling-demo" },
        }}
      />
    </Stack.Navigator>
  );
}
