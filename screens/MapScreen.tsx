import * as eventsActions from "../store/actions/events";
import getAddressFromCoordinate from "../common/getAddressFromCoordinate";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import MapView, { Callout } from "react-native-maps";
import React, { useCallback, useEffect, useRef, useState } from "react";
import StyledText from "../components/StyledText";
import { saveEvent } from "../store/actions/events";
import { useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-paper";
import { Coordinate } from "../interfaces/coordinate";
import { Event } from "../interfaces/event";
import { Marker } from "react-native-maps";
import { Text, View } from "../components/Themed";

export default function MapScreen({ navigation }: any) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [markers, setMarkers] = useState(null);
  const colorScheme = useColorScheme();
  const events = useSelector((state: any) => state.events.events);
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const savedEvents: Event[] = useSelector(
    (state: any) => state.events.savedEvents
  );

  const loadEvents = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      dispatch(eventsActions.fetchEvents());
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(
          "An error occurred ❌",
          "We couldn't load events, sorry.\nTry to reload TamoTam!",
          [{ text: "Okay" }]
        );
        setError(err.message);
      }
    }
    setIsLoading(false);
  }, [dispatch, setError]);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const saveEventHandler = (event: Event) => {
    setError("");
    setIsLoading(true);

    try {
      if (savedEvents.some((savedEvent: Event) => savedEvent.id === event.id)) {
        Alert.alert("Duplicated saved event", error, [{ text: "Okay" }]);
        setIsLoading(false);
        return;
      }
      dispatch(saveEvent(event));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          color={colorScheme === "dark" ? Colors.dark.text : Colors.light.text}
          size="large"
        />
      </View>
    );
  }

  const Map = () => (
    <View style={styles.container}>
      {/* TODO: Generate custom map styles based on https://mapstyle.withgoogle.com with Retro theme. */}
      <MapView
        onLongPress={async (e) => await getAddressFromCoordinate(e)}
        ref={mapRef}
        style={styles.map}
      >
        {/* TODO: After outsourcing/refactoring fetching the data in store adjust the markers after API will stop returning 402. */}
        {events.map((event: Event) => {
          return (
            <Marker
              coordinate={{
                latitude: event.coordinate.latitude,
                longitude: event.coordinate.longitude,
              }}
            >
              <Callout
                onPress={() => saveEventHandler(event)}
                style={[
                  styles.locationButtonCallout,
                  {
                    backgroundColor:
                      colorScheme === "dark"
                        ? Colors.dark.background
                        : Colors.light.background,
                    borderColor:
                      colorScheme === "dark"
                        ? Colors.dark.text
                        : Colors.light.text,
                    shadowColor:
                      colorScheme === "dark"
                        ? Colors.dark.text
                        : Colors.light.text,
                  },
                ]}
                tooltip
              >
                <StyledText style={styles.title}>{event.title}</StyledText>
                <Image
                  source={{
                    uri:
                      event.imageUrl === ""
                        ? "https://picsum.photos/700"
                        : event.imageUrl,
                  }}
                  style={styles.image}
                />
                <StyledText style={styles.description}>
                  {event.description}
                </StyledText>
                <StyledText style={styles.description}>
                  🗓️ {event.date}
                </StyledText>
                <StyledText style={styles.description}>
                  🕒 {event.time}
                </StyledText>
                <Button
                  color={
                    colorScheme === "dark"
                      ? Colors.dark.text
                      : Colors.light.text
                  }
                  icon="check-circle-outline"
                >
                  Save
                </Button>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );

  return <Map />;
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "justify",
  },
  image: {
    width: "100%",
    height: "50%",
  },
  locationButtonCallout: {
    borderRadius: 10,
    borderWidth: 1,
    height: 300,
    overflow: "scroll",
    padding: 10,
    shadowRadius: 15,
    width: 300,
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
