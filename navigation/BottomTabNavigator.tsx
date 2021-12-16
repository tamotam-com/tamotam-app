import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import MapScreen from "../screens/MapScreen";
import React from "react";
import SavedScreen from "../screens/SavedScreen";
import StyledText from "../components/StyledText";
import TabBarIcon from "../components/TabBarIcon";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import { BottomTabParamList, MapParamList, SavedParamList } from "../types";
import { FAB, Portal } from "react-native-paper";

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator({ navigation }: any) {
  const colorScheme = useColorScheme();
  const isFocused = useIsFocused();

  return (
    <React.Fragment>
      <BottomTab.Navigator
        activeColor={
          colorScheme === "dark" ? Colors.dark.text : Colors.light.text
        }
        barStyle={{
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        }}
        inactiveColor={
          colorScheme === "dark" ? Colors.dark.text : Colors.light.text
        }
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
      </BottomTab.Navigator>
      <Portal>
        <FAB
          color={colorScheme === "dark" ? Colors.dark.text : Colors.light.text}
          icon="map-marker-plus-outline"
          onPress={() => navigation.navigate("NewEvent")}
          style={{
            backgroundColor:
              colorScheme === "dark"
                ? Colors.dark.background
                : Colors.light.background,
            borderWidth: 1,
            borderColor:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
            shadowColor:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
            shadowRadius: 15,
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

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const MapStack = createStackNavigator<MapParamList>();

function MapNavigator() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          headerTitleStyle: { fontFamily: "boiling-demo" },
          headerShown: true,
        }}
      />
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
        options={{
          headerShown: true,
          headerTitle: "Saved",
          headerTitleStyle: { fontFamily: "boiling-demo" },
        }}
      />
    </SavedStack.Navigator>
  );
}
