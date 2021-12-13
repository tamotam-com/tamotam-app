import * as eventsActions from "../store/actions/events";
import StyledText from "../components/StyledText";
import { addEvent } from "../store/actions/events";
import getAddressFromCoordinate from "../common/getAddressFromCoordinate";
import useColorScheme from "../hooks/useColorScheme";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import MapView, { Callout } from "react-native-maps";
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

  const loadEvents = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      dispatch(eventsActions.fetchEvents());
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(
          "An error occurred ❌",
          "We couldn't load events, sorry.\nTry to reload tamotam!",
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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          color={colorScheme === "dark" ? "#ffbfbf" : "#b30000"}
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
        ref={(ref) => (this.mapRef = ref)}
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
            <Image
              source={{ uri: "https://picsum.photos/700" }}
              style={styles.image}
            />
            <Button
              color={colorScheme === "dark" ? "#b30000" : "#ffbfbf"}
              icon="check-circle-outline"
              onPress={() => dispatch(addEvent())}
            >
              Save
            </Button>
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
    backgroundColor: "#ffbfbf",
    borderRadius: 10,
    height: 200,
    padding: 10,
    width: 200,
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
