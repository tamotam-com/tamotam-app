import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import MapScreen from "../screens/MapScreen";
import React, { Fragment } from "react";
import SavedScreen from "../screens/SavedScreen";
import TabBarIcon from "../components/TabBarIcon";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import { BottomTabParamList, MapParamList, SavedParamList } from "../types";
import { ColorSchemeName } from "react-native";
import { FAB, Portal } from "react-native-paper";

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator({ navigation }: any) {
  const colorScheme: ColorSchemeName = useColorScheme();
  const isFocused: boolean = useIsFocused();

  return (
    <Fragment>
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
          component={MapNavigator}
          name="Map"
          options={{
            tabBarIcon: ({ color, focused }) => {
              let iconName: string = !focused
                ? "map-check"
                : "map-check-outline";

              return <TabBarIcon color={color} name={iconName} />;
            },
          }}
        />
        <BottomTab.Screen
          component={SavedNavigator}
          name="Saved"
          options={{
            tabBarIcon: ({ color, focused }) => {
              let iconName: string = !focused
                ? "bookmark"
                : "bookmark-check-outline";

              return <TabBarIcon color={color} name={iconName} />;
            },
          }}
        />
      </BottomTab.Navigator>
      <Portal>
        <FAB
          color={colorScheme === "dark" ? Colors.dark.text : Colors.light.text}
          customSize={64}
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
            borderRadius: 50,
            bottom: 125,
            position: "absolute",
            right: 10,
            shadowColor:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
            shadowRadius: 15,
          }}
          visible={isFocused}
        />
      </Portal>
    </Fragment>
  );
}

const MapStack = createStackNavigator<MapParamList>();
function MapNavigator() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen
        component={MapScreen}
        name="MapScreen"
        options={{
          headerShown: true,
          headerTitle: "Map",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "boiling-demo" },
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
        component={SavedScreen}
        name="SavedScreen"
        options={{
          headerShown: true,
          headerTitle: "Saved",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "boiling-demo" },
        }}
      />
    </SavedStack.Navigator>
  );
}
