/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import DrawerScreen from "../screens/DrawerScreen";
import MapScreen from "../screens/MapScreen";
import SavedEventsScreen from "../screens/SavedEventsScreen";
import {
  BottomTabParamList,
  DrawerScreenParamList,
  SavedEventsParamList,
  MapParamList,
} from "../types";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Map"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Map"
        component={MapNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => {
            let iconName: string = focused ? "map" : "map-outline";

            return <TabBarIcon name={iconName} color={color} />;
          },
        }}
      />
      <BottomTab.Screen
        name="SavedEvents"
        component={SavedEventsNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => {
            let iconName: string = focused ? "calendar" : "calendar-outline";

            return <TabBarIcon name={iconName} color={color} />;
          },
        }}
      />
      <BottomTab.Screen
        name="DrawerStack"
        component={DrawerStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const MapStack = createStackNavigator<MapParamList>();

function MapNavigator() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerTitle: "Bratolek tamotam" }}
      />
    </MapStack.Navigator>
  );
}

const SavedEventsStack = createStackNavigator<SavedEventsParamList>();

function SavedEventsNavigator() {
  return (
    <SavedEventsStack.Navigator>
      <SavedEventsStack.Screen
        name="SavedEventsScreen"
        component={SavedEventsScreen}
        options={{ headerTitle: "Saved" }}
      />
    </SavedEventsStack.Navigator>
  );
}

const DrawerStack = createDrawerNavigator<DrawerScreenParamList>();

function DrawerStackNavigator() {
  return (
    <DrawerStack.Navigator>
      <DrawerStack.Screen
        name="DrawerScreen"
        component={DrawerScreen}
        options={{ headerTitle: "DrawerScreen" }}
      />
      <DrawerStack.Screen
        name="DrawerScreen2"
        component={DrawerScreen}
        options={{ headerTitle: "DrawerScreen2" }}
      />
    </DrawerStack.Navigator>
  );
}
