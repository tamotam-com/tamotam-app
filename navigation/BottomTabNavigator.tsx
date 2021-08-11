/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import { FAB, Portal } from "react-native-paper";
import * as React from "react";

// import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import MapScreen from "../screens/MapScreen";
import NewEventScreen from "../screens/NewEventScreen";
import SavedScreen from "../screens/SavedScreen";
import TabBarIcon from "../components/TabBarIcon";
import { BottomTabParamList, MapParamList, SavedParamList } from "../types";

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator({ navigation }) {
  const colorScheme = useColorScheme();
  const isFocused = useIsFocused();

  return (
    <React.Fragment>
      <BottomTab.Navigator
        activeColor={colorScheme === "dark" ? "#ffbfbf" : "#b30000"}
        barStyle={{
          backgroundColor: colorScheme === "dark" ? "#000000" : "#ffffff",
        }}
        inactiveColor={colorScheme === "dark" ? "#ffffff" : "#000000"}
        initialRouteName="Map"
        sceneAnimationEnabled={true}
        shifting={true}
      >
        <BottomTab.Screen
          name="Map"
          component={MapNavigator}
          options={{
            tabBarIcon: ({ color, focused }) => {
              let iconName: string = !focused
                ? "map-check"
                : "map-check-outline";

              return <TabBarIcon name={iconName} color={color} />;
            },
          }}
        />
        <BottomTab.Screen
          name="Saved"
          component={SavedNavigator}
          options={{
            tabBarIcon: ({ color, focused }) => {
              let iconName: string = !focused
                ? "bookmark"
                : "bookmark-check-outline";

              return <TabBarIcon name={iconName} color={color} />;
            },
          }}
        />
        <BottomTab.Screen
          name="NewEvent"
          component={NewEventNavigator}
          options={{
            tabBarIcon: ({ color, focused }) => {
              let iconName: string = !focused
                ? "map-marker-plus-outline"
                : "map-marker-plus-outline";

              return <TabBarIcon name={iconName} color={color} />;
            },
          }}
        />
      </BottomTab.Navigator>
      <Portal>
        <FAB
          color={colorScheme === "dark" ? "#ffbfbf" : "#b30000"}
          icon="map-marker-plus-outline"
          onPress={() => navigation.navigate("NewEvent")}
          style={{
            backgroundColor: colorScheme === "dark" ? "#000000" : "#ffffff",
            position: "absolute",
            bottom: 100,
            right: 16,
          }}
          visible={isFocused}
        />
      </Portal>
    </React.Fragment>
  );
}

const NewEventStack = createStackNavigator<MapParamList>();

function NewEventNavigator() {
  return (
    <NewEventStack.Navigator>
      <NewEventStack.Screen name="NewEvent" component={NewEventScreen} />
    </NewEventStack.Navigator>
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const MapStack = createStackNavigator<MapParamList>();

function MapNavigator() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen name="Map" component={MapScreen} />
    </MapStack.Navigator>
  );
}

const SavedStack = createStackNavigator<SavedParamList>();

function SavedNavigator() {
  return (
    <SavedStack.Navigator>
      <SavedStack.Screen
        name="SavedScreen"
        component={SavedScreen}
        options={{ headerTitle: "Saved" }}
      />
    </SavedStack.Navigator>
  );
}
