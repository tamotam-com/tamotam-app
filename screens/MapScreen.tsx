import * as eventsActions from "../store/actions/events";
import * as Location from "expo-location";
import getAddressFromCoordinate from "../common/getAddressFromCoordinate";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import CustomMapStyles from "../constants/CustomMapStyles";
import MapView from "react-native-map-clustering";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Dispatch,
  MutableRefObject,
} from "react";
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
import { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Event } from "../interfaces/event";
import { Region } from "../interfaces/region";
import { View } from "../components/Themed";

export default function MapScreen() {
  const colorScheme: "light" | "dark" = useColorScheme();
  const dispatch: Dispatch<any> = useDispatch<Dispatch<any>>();
  const events: Event[] = useSelector((state: any) => state.events.events);
  const mapRef: MutableRefObject<null> = useRef<null>(null);
  const savedEvents: Event[] = useSelector(
    (state: any) => state.events.savedEvents
  );
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialRegionValue, setInitialRegionValue] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const loadEvents: () => Promise<void> = useCallback(async () => {
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
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    setIsLoading(true);

    loadEvents().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadEvents]);

  const getUserLocationHandler: () => Promise<void> = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const location = await Location.getCurrentPositionAsync({});

      setInitialRegionValue({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 10,
        longitudeDelta: 10,
      });
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(
          "An error occurred ❌",
          "We couldn't fetch your location.\nPlease give us the permissions, and it's essential to use TamoTam!",
          [{ text: "Okay" }]
        );

        setError(error.message);
      }
    }
    setIsLoading(false);
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    getUserLocationHandler().then(() => {
      setIsLoading(false);
    });
  }, [getUserLocationHandler]);

  const saveEventHandler: (event: Event) => void = (event: Event) => {
    setError("");
    setIsLoading(true);

    try {
      if (savedEvents.some((savedEvent: Event) => savedEvent.id === event.id)) {
        Alert.alert("This event is already in your Saved events.", error, [
          { text: "Okay" },
        ]);
        setIsLoading(false);
        return;
      }
      dispatch(saveEvent(event));
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(
          "An error occurred ❌",
          "TamoTam couldn't save this event.\nTry one more time!",
          [{ text: "Okay" }]
        );

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

  const Map: () => JSX.Element = () => (
    <View style={styles.container}>
      <MapView
        clusterColor={
          colorScheme === "dark"
            ? Colors.dark.background
            : Colors.light.background
        }
        clusterFontFamily={"boiling-demo"}
        clusterTextColor={
          colorScheme === "dark" ? Colors.dark.text : Colors.light.text
        }
        customMapStyle={CustomMapStyles.CUSTOM_MAP_STYLES}
        followsUserLocation={true}
        initialRegion={initialRegionValue}
        onRegionChange={async (region) =>
          await getAddressFromCoordinate(mapRef, region)
        }
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        showsUserLocation={true}
        style={styles.map}
      >
        {/* TODO: After outsourcing/refactoring fetching the data in store adjust the markers after API will stop returning 402. */}
        {events.map((event: Event) => {
          return new Date().getTime() < new Date(event.date).getTime() ? (
            <Marker
              coordinate={{
                latitude: event.coordinate.latitude,
                longitude: event.coordinate.longitude,
              }}
              icon={require("../assets/images/icon-map.png")}
              key={event.id}
              tracksViewChanges={false}
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
                <StyledText style={styles.title}>
                  {event.title ? event.title : "No information about title."}
                </StyledText>
                <Image
                  source={
                    event.imageUrl === ""
                      ? require("../assets/images/no-image.jpeg")
                      : event.imageUrl
                  }
                  style={styles.image}
                />
                <StyledText style={styles.description}>
                  {event.description
                    ? event.description
                    : "No information about description."}
                </StyledText>
                <StyledText style={styles.description}>
                  🗓️{" "}
                  {event.date
                    ? event.date.toLocaleDateString()
                    : "No information about date."}
                </StyledText>
                <StyledText style={styles.description}>
                  🕒{" "}
                  {event.date
                    ? event.date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "No information about time."}
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
          ) : null;
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
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "justify",
  },
  image: {
    height: "50%",
    width: "100%",
  },
  locationButtonCallout: {
    borderRadius: 10,
    borderWidth: 1,
    height: 400,
    padding: 10,
    shadowRadius: 15,
    width: 350,
  },
  map: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
