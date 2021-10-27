import * as eventsActions from "../store/actions/events";
import StyledText from "../components/StyledText";
import { addEvent } from "../store/actions/events";
import getAddressFromCoordinate from "../common/getAddressFromCoordinate";
import useColorScheme from "../hooks/useColorScheme";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import MapView, { Callout } from "react-native-maps";
import { Alert, Button, Dimensions, StyleSheet } from "react-native";
import { Coordinate } from "../interfaces/coordinate";
import { Event } from "../interfaces/event";
import { Marker } from "react-native-maps";
import { Text, View } from "../components/Themed";

export default function MapScreen({ navigation }: any) {
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState(null);
  const colorScheme = useColorScheme();
  const events = useSelector((state: any) => state.events.events);
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

  const Map = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Map</Text>
      {/* TODO: Generate custom map styles based on https://mapstyle.withgoogle.com with Retro theme. */}
      <MapView
        onRegionChange={async (e) => await getAddressFromCoordinate()}
        style={styles.map}
      >
        {/* TODO: After outsourcing/refactoring fetching the data in store adjust the markers after API will stop returning 402. */}
        <Marker
          coordinate={{
            latitude: events.coordinate.latitude,
            longitude: events.coordinate.longitude,
          }}
        >
          <Callout style={styles.locationButtonCallout} tooltip>
            <StyledText style={styles.title}>{events.title}</StyledText>
            <Button onPress={() => dispatch(addEvent())} title={"Save"} />
            <StyledText style={styles.description}>
              {events.description}
            </StyledText>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );

  return <Map />;
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
    borderRadius: 10,
    backgroundColor: "#ffbfbf",
    padding: 10,
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
