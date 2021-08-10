import * as eventsActions from "../store/actions/events";
import StyledText from "../components/StyledText";
import { addEvent } from "../store/actions/events";
import useColorScheme from "../hooks/useColorScheme";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import MapView, { Callout } from "react-native-maps";
import { Alert, Button, Dimensions, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { Text, View } from "../components/Themed";

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
          <Callout style={styles.locationButtonCallout} tooltip>
            <StyledText style={styles.title}>{events.title}</StyledText>
            <Button onPress={() => dispatch(addEvent(1))} title={"Save"} />
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
