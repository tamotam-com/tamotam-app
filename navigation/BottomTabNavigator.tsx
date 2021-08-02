/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator,
  DrawerContentScrollView, } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import MapScreen from "../screens/MapScreen";
import SavedScreen from "../screens/SavedScreen";
import TabBarIcon from "../components/TabBarIcon";
import { BottomTabParamList, MapParamList, SavedParamList } from "../types";
import { StyleSheet, View } from 'react-native';

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
        name="Saved"
        component={SavedNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => {
            let iconName: string = focused ? "calendar" : "calendar-outline";

            return <TabBarIcon name={iconName} color={color} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}

export function DrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={
          styles.drawerContent
        }
      >
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => {}}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={false} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const MapStack = createDrawerNavigator<MapParamList>();

function MapNavigator() {
  return (
    <MapStack.Navigator drawerContent={() => <DrawerContent />}>
      <MapStack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerTitle: "Bratolek tamotam" }}
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
        options={{ headerTitle: "Saved" }}
      />
    </SavedStack.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});