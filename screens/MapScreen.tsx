import * as eventsActions from "../store/actions/events";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import StyledText from "../components/StyledText";
import { createStackNavigator } from "@react-navigation/stack";
import { toggleFavorite } from "../store/actions/events";
import useColorScheme from "../hooks/useColorScheme";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import MapView, { Callout } from "react-native-maps";
import { Alert, Button, Dimensions, StyleSheet } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Marker } from "react-native-maps";
import { SavedParamList } from "../types";
import { Text, View } from "../components/Themed";

const SavedStack = createStackNavigator<SavedParamList>();

async function onRegionChange(this: any) {
  // TODO: It breaks when the app will reload.
  if (this.mapRef) {
    try {
      const camera = await this.mapRef.getCamera();
      console.log("test", camera);
    } catch (err) {
      console.error(err);
    }
  }
}

export default function MapScreen({ navigation }) {
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState(null);
  const colorScheme = useColorScheme();
  const events = useSelector((state) => state.events.events);
  const dispatch = useDispatch();

  const loadEvents = useCallback(async () => {
    setError(null);
    try {
      await dispatch(eventsActions.fetchEvents());
    } catch (error) {
      Alert.alert(
        "An error occurred ❌",
        "We couldn't load events, sorry.\nTry to reload tamotam!",
        [{ text: "Okay" }]
      );
      setError(error.message);
    }
  }, [dispatch, setError]);

  useEffect(() => {
    loadEvents();
  }, []);

  // TODO: Make adding favorites working.
  // const toggleFavoriteHandler = useCallback(() => {
  //   dispatchEvent(toggleFavorite(1));
  // }, [dispatch]);

  // useEffect(() => {
  //   navigation.setParam({ toggleFav: toggleFavoriteHandler });
  // }, [toggleFavoriteHandler]);

  const Map = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Map</Text>
      {/* TODO: Generate custom map styles based on https://mapstyle.withgoogle.com with Retro theme. */}
      <MapView
        ref={(ref) => (this.mapRef = ref)}
        onRegionChange={async (e) => await onRegionChange()}
        style={styles.map}
      >
        {/* TODO: Add Callout for events fetched from API's. */}
        {/* TODO: After outsourcing/refactoring fetching the data in store adjust the markers after API will stop returning 402. */}
        {/* TODO: Uncomment this once access to the API will be back. */}
        <Marker
          coordinate={{
            latitude: events.coordinate.latitude,
            longitude: events.coordinate.longitude,
          }}
        >
          <Callout style={styles.locationButtonCallout}>
            <StyledText style={styles.title}>{events.title}</StyledText>
            <Button
              onPress={() => dispatch(toggleFavorite(1))}
              title={"Callout Button"}
            />
            <StyledText style={styles.description}>
              {events.description}
            </StyledText>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );

  return (
    <SavedStack.Navigator>
      <SavedStack.Screen
        name="Map"
        component={Map}
        options={(props) => {
          const { toggleDrawer } = props.navigation;
          return {
            headerLeft: () => (
              <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
                <Item
                  color={colorScheme === "dark" ? "#ffffff" : "#000000"}
                  iconName="menu"
                  onPress={toggleDrawer}
                  title="Menu"
                />
              </HeaderButtons>
            ),
          };
        }}
      />
    </SavedStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "justify",
  },
  locationButtonCallout: {
    borderRadius: 0,
    opacity: 0.8,
    backgroundColor: "lightgrey",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});