import * as Location from "expo-location";
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import useColorScheme from "../hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { fetchEvents, readItemFromStorage, saveEvent } from "../store/actions/events";
import { useDispatch, useSelector } from "react-redux";
import { useNetInfo, NetInfoState } from "@react-native-community/netinfo";
import {
  ActivityIndicator,
  Alert,
  ColorSchemeName,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
} from "react-native";
import { Button } from "react-native-paper";
import { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Event } from "../interfaces/event";
import { Region } from "../interfaces/region";
import { View } from "../components/Themed";

export default function MapScreen() {
  const colorScheme: ColorSchemeName = useColorScheme();
  const dispatch: Dispatch<any> = useDispatch<Dispatch<any>>();
  const events: Event[] = useSelector((state: any) => state.events.events);
  const internetState: NetInfoState = useNetInfo();
  const mapRef: MutableRefObject<null> = useRef<null>(null);
  const savedEvents: Event[] = useSelector(
    (state: any) => state.events.savedEvents
  );
  const [error, setError] = useState<Error>(new Error);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialRegionValue, setInitialRegionValue] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  useEffect(() => {
    if (error.message !== "") {
      Alert.alert(
        "Unknown Error ❌",
        "Please report this error by sending an email to us at feedback@tamotam.com. It will help us 🙏\nError details: " + error.message + "\nDate: " + new Date(),
        [{ text: "Okay" }]
      );
    }
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> MapScreen -> useEffect[error], error: " + error,
    });
    crashlytics().recordError(error);
  }, [error]);

  const loadEvents: () => Promise<void> = useCallback(async () => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> MapScreen -> loadEvents",
    });
    setError(new Error(""));
    setIsLoading(true);

    try {
      const cacheExpiryTime: Date = new Date();
      const cacheIntervalInHours: number = 24 * 7;
      const eventsInJSONString: any = await AsyncStorage.getItem("EVENTS_ASYNC_STORAGE");
      let expirationEventsDate: any;
      let expirationEventsDateParsed: any;

      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> MapScreen -> loadEvents -> try, eventsInJSONString: " + eventsInJSONString,
      });
      try {
        expirationEventsDate = await AsyncStorage.getItem("EXPIRATION_DATE_ASYNC_STORAGE");
        expirationEventsDateParsed = new Date(JSON.parse(expirationEventsDate));

        analytics().logEvent("custom_log", {
          description: "--- Analytics: screens -> MapScreen -> loadEvents -> try -> try1, expirationEventsDate: " + expirationEventsDate,
        });
        analytics().logEvent("custom_log", {
          description: "--- Analytics: screens -> MapScreen -> loadEvents -> try -> try1, expirationEventsDateParsed: " + expirationEventsDateParsed,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          analytics().logEvent("custom_log", {
            description: "--- Analytics: screens -> MapScreen -> loadEvents -> try -> catch1, error: " + error,
          });
          crashlytics().recordError(error);
          setError(new Error(error.message));
        }
      } finally {
        analytics().logEvent("custom_log", {
          description: "--- Analytics: screens -> MapScreen -> loadEvents -> try -> finally1",
        });
      }

      if (!expirationEventsDate) {
        // Next time, fetch data from API's in a week from now.
        cacheExpiryTime.setHours(cacheExpiryTime.getHours() + cacheIntervalInHours);
        const cacheExpiryTimeInJSONString: string = JSON.stringify(cacheExpiryTime);
        try {
          await AsyncStorage.setItem("EXPIRATION_DATE_ASYNC_STORAGE", cacheExpiryTimeInJSONString);

          analytics().logEvent("custom_log", {
            description: "--- Analytics: screens -> MapScreen -> loadEvents -> try -> try2, cacheExpiryTimeInJSONString: " + cacheExpiryTimeInJSONString,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            analytics().logEvent("custom_log", {
              description: "--- Analytics: screens -> MapScreen -> loadEvents -> try -> catch2, error: " + error,
            });
            crashlytics().recordError(error);
            setError(new Error(error.message));
          }
        } finally {
          Alert.alert(
            "Loading ℹ️",
            "If it's your first time, it might take a while. If not, it should be quick. Events will be shown gradually; once the process is completed, you will see a notification. Almost there, a bit of patience 🙏",
            [{ text: "Okay" }]
          );
          analytics().logEvent("custom_log", {
            description: "--- Analytics: screens -> MapScreen -> loadEvents -> try -> finally2",
          });
        }
      }

      const eventsParsed: Event[] = JSON.parse(eventsInJSONString);
      if (new Date().getTime() >= expirationEventsDateParsed.getTime() || eventsInJSONString === null) {
        dispatch(fetchEvents());
        return;
      }
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> MapScreen -> loadEvents -> try, new Date().getTime(): " + new Date().getTime(),
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> MapScreen -> loadEvents -> try, eventsParsed: " + eventsParsed,
      });
      dispatch(readItemFromStorage(eventsParsed));
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ❌",
          "We couldn't load events, sorry.\nTry to reload TamoTam!",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: screens -> MapScreen -> loadEvents -> catch, error: " + error,
        });
        crashlytics().recordError(error);
        setError(new Error(error.message));
      }
    } finally {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> MapScreen -> loadEvents -> finally",
      });
      setIsLoading(false);
    }
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> MapScreen -> useEffect[loadEvents]",
    });
    loadEvents();
  }, [loadEvents]);

  const getUserLocationHandler: () => Promise<void> = useCallback(async () => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> MapScreen -> getUserLocationHandler",
    });
    setError(new Error(""));
    setIsLoading(true);

    if (Platform.OS !== "web") {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> MapScreen -> getUserLocationHandler, status: " + status,
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> MapScreen -> getUserLocationHandler, Platform.OS: " + Platform.OS,
      });
      if (status !== "granted") {
        Alert.alert(
          "⚠️ Insufficient permissions! ⚠️",
          "Sorry, we need location permissions to make this work!",
          [{ text: "Okay" }]
        );
        return;
      }
    }

    try {
      const location: Location.LocationObject = await Location.getCurrentPositionAsync({});

      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> MapScreen -> getUserLocationHandler -> try, location.coords.latitude: " + location.coords.latitude.toString,
      });
      setInitialRegionValue({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 10,
        longitudeDelta: 10,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ❌",
          "We couldn't fetch your location.\nPlease give us the permissions, and it's essential to use TamoTam!",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: screens -> MapScreen -> getUserLocationHandler -> catch, error: " + error,
        });
        crashlytics().recordError(error);
        setError(new Error(error.message));
      }
    } finally {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> MapScreen -> getUserLocationHandler -> finally",
      });
      setIsLoading(false);
    }
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> MapScreen -> useEffect[getUserLocationHandler]",
    });
    getUserLocationHandler();
  }, [getUserLocationHandler]);

  const saveEventHandler: (event: Event) => void = (event: Event) => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> MapScreen -> saveEventHandler",
    });
    setError(new Error(""));
    setIsLoading(true);

    try {
      if (savedEvents.some((savedEvent: Event) => savedEvent.id === event.id)) {
        Alert.alert("Error ❌", "This event is already in your Saved events.", [
          { text: "Okay" },
        ]);
        return;
      }

      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> MapScreen -> saveEventHandler -> try, savedEvent: " + savedEvents,
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> MapScreen -> saveEventHandler -> try, event: " + event,
      });
      dispatch(saveEvent(event));
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ❌",
          "TamoTam couldn't save this event.\nTry one more time!",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: screens -> MapScreen -> saveEventHandler -> catch, error: " + error,
        });
        crashlytics().recordError(error);
        setError(new Error(error.message));
      }
    } finally {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> MapScreen -> saveEventHandler -> finally",
      });
      setIsLoading(false);
    }
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

  if (internetState.isConnected === false) {
    return (
      <View style={styles.centered}>
        <StyledText style={styles.title}>
          Please turn on the Internet to use TamoTam.
        </StyledText>
      </View>
    );
  }

  const Map: () => JSX.Element = () => (
    <View style={styles.centered}>
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
              icon={event.isUserEvent ? require("../assets/images/icon-map-user-event.png") : require("../assets/images/icon-map-tamotam-event.png")}
              key={event.id}
              onCalloutPress={() => saveEventHandler(event)} // For Android.
              tracksViewChanges={false}
            >
              <Callout
                onPress={() => saveEventHandler(event)} // For iOS.
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
                {Platform.OS === "android" ? <Text style={styles.imageWrapperAndroid}>
                  <Image
                    resizeMode="cover"
                    source={
                      typeof event.imageUrl === "string" && event.imageUrl !== ""
                        ? { uri: event.imageUrl }
                        : require("../assets/images/no-image.jpeg")
                    }
                    style={styles.imageAndroid}
                  />
                </Text> : <Image
                  source={
                    typeof event.imageUrl === "string" && event.imageUrl !== ""
                      ? { uri: event.imageUrl }
                      : require("../assets/images/no-image.jpeg")
                  }
                  style={styles.imageIOS}
                />}
                <StyledText style={styles.description}>
                  {event.description
                    ? event.description
                    : "No information about description."}
                </StyledText>
                <StyledText style={styles.description}>
                  🗓️{" "}
                  {isNaN(Number(event.date))
                    ? "No information"
                    : event.date.toLocaleDateString()}
                </StyledText>
                <StyledText style={styles.description}>
                  🕒{" "}
                  {isNaN(Number(event.date))
                    ? "No information"
                    : event.date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
  description: {
    fontSize: 14,
    textAlign: "justify",
  },
  imageAndroid: {
    height: 200,
    width: 330,
  },
  imageIOS: {
    height: "50%",
    width: "100%",
  },
  imageWrapperAndroid: {
    height: 200,
    flex: 1,
    marginTop: -85,
    width: 330,
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
