import analytics from "@react-native-firebase/analytics";
import BottomTabNavigator from "./BottomTabNavigator";
import Colors from "../constants/Colors";
import EditEventScreen from "../screens/EditEventScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import LinkingConfiguration from "./LinkingConfiguration";
import NewEventScreen from "../screens/NewEventScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import React, { useEffect, useRef } from "react";
import StyledText from "../components/StyledText";
import { createStackNavigator } from "@react-navigation/stack";
import useColorScheme from "../hooks/useColorScheme";
import { useNetInfo, NetInfoState } from "@react-native-community/netinfo";
import { Alert, ColorSchemeName, StyleSheet, View } from "react-native";
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
  const colorScheme: ColorSchemeName = useColorScheme();
  const internetState: NetInfoState = useNetInfo();

  useEffect(() => {
    if (internetState.isConnected === false) {
      Alert.alert(
        "No Internet! ❌",
        "Sorry, we need an Internet connection for TamoTam to run correctly.",
        [{ text: "Okay" }]
      );
    }
    analytics().logEvent("custom_log", {
      description: "--- Analytics: navigation -> index -> useEffect[internetState.isConnected]: " + internetState.isConnected,
    });
  }, [internetState.isConnected]);

  if (internetState.isConnected === false) {
    return (
      <View style={[styles.centered, {
        backgroundColor:
          colorScheme === "dark"
            ? Colors.dark.background
            : Colors.light.background,
      }]}>
        <StyledText style={[styles.title, {
          color:
            colorScheme === "dark" ? Colors.dark.text : Colors.light.text
        }]}>
          Please turn on the Internet to use TamoTam.
        </StyledText>
      </View>
    );
  }

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

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
