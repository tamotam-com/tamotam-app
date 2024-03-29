import * as Location from "expo-location";
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import useColorScheme from "../hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";
import CustomMapStyles from "../constants/CustomMapStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import { fetchBikeRegEvents } from "../store/actions/apis/bikeRegEvents";
import { fetchPredictHqEvents } from "../store/actions/apis/predictHqEvents";
import { fetchRunRegEvents } from "../store/actions/apis/runRegEvents";
import { fetchSeatGeekEvents } from "../store/actions/apis/seatGeekEvents";
import { fetchSkiRegEvents } from "../store/actions/apis/skiRegEvents";
import { fetchTicketmasterEvents } from "../store/actions/apis/ticketmasterEvents";
import { fetchTriRegEvents } from "../store/actions/apis/triRegEvents";
import { fetchUsersEvents } from "../store/actions/apis/usersEvents";
import { readItemFromStorage, saveEvent } from "../store/actions/events";
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
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Event } from "../interfaces/event";
import { MaterialIcons } from "@expo/vector-icons";
import { Region } from "../interfaces/region";
import { View } from "../components/Themed";
import { Modal } from "react-native";

export default function MapScreen() {

  const colorScheme: ColorSchemeName = useColorScheme();
  const dispatch: Dispatch<any> = useDispatch<Dispatch<any>>();
  const events: Event[] = useSelector((state: any) => state.events.events);
  const internetState: NetInfoState = useNetInfo();
  const mapRef: MutableRefObject<null> = useRef<null>(null);
  const savedEvents: Event[] = useSelector(
    (state: any) => state.events.savedEvents
  );

  const [error, setError] = useState<Error>(new Error());
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [initialRegionValue, setInitialRegionValue] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [isEndDateSelected, setIsEndDateSelected] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStartDateSelected, setIsStartDateSelected] = useState<boolean>(false);
  const [selectedDatepicker, setSelectedDatepicker] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<any | Date>(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<any | Date>(new Date());
  const [showDatepicker, setShowDatepicker] = useState<boolean>(false);

  const eventsOnMap: Event[] = isFiltering ? filteredEvents : events;

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
        // Next time, fetch data from API"s in a week from now.
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
          analytics().logEvent("custom_log", {
            description: "--- Analytics: screens -> MapScreen -> loadEvents -> try -> finally2",
          });
        }
      }

      const eventsParsed: Event[] = JSON.parse(eventsInJSONString);
      if (new Date().getTime() >= expirationEventsDateParsed.getTime() || eventsInJSONString === null) {
        const promiseBikeRegEvents: void = dispatch(fetchBikeRegEvents());
        const promisePredictHqEvents: void = dispatch(fetchPredictHqEvents());
        const promiseRunRegEvents: void = dispatch(fetchRunRegEvents());
        const promiseSeatGeekEvents: void = dispatch(fetchSeatGeekEvents());
        const promiseSkiRegEvents: void = dispatch(fetchSkiRegEvents());
        const promiseTicketmasterEvents: void = dispatch(fetchTicketmasterEvents());
        const promiseTriRegEvents: void = dispatch(fetchTriRegEvents());
        const promiseUsersEvents: void = dispatch(fetchUsersEvents());

        Promise.allSettled([
          promiseBikeRegEvents,
          promiseRunRegEvents,
          promisePredictHqEvents,
          promiseSeatGeekEvents,
          promiseSkiRegEvents,
          promiseTicketmasterEvents,
          promiseTriRegEvents,
          promiseUsersEvents,
        ])
          .then(() => {
            analytics().logEvent("custom_log", {
              description:
                "--- Analytics: screens -> MapScreen -> loadEvents -> try -> then",
            });
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              analytics().logEvent("custom_log", {
                description:
                  "--- Analytics: screens -> MapScreen -> loadEvents -> try -> catch3, error: " +
                  error,
              });
              crashlytics().recordError(error);
            }
          })
          .finally(() => {
            analytics().logEvent("custom_log", {
              description:
                "--- Analytics: screens -> MapScreen -> loadEvents -> try -> finally3 -> Promise.allSettled([...]) -> finally",
            });
          });
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
        setInitialRegionValue({
          latitude: 52.3676,
          longitude: 4.9041,
          latitudeDelta: 10,
          longitudeDelta: 10,
        });

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

  const onClearFilters: () => void = () => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> MapScreen -> onClearFilters",
    });
    setFilteredEvents([]);
    setIsEndDateSelected(false);
    setIsFiltering(false);
    setIsFilterModalVisible(false);
    setIsStartDateSelected(false);
    setSelectedEndDate(new Date());
    setSelectedStartDate(new Date());
  };

  const onFilterDateEvents: () => void = () => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> MapScreen -> onFilterDateEvents",
    });
    const filtered: Event[] = events.filter((event: Event) => {
      const eventDate: number = new Date(event.date).getTime();
      const startDate: number = selectedStartDate ?? selectedStartDate.getTime();
      const endDate: number = selectedEndDate ?? selectedEndDate.getTime();

      return eventDate >= startDate && eventDate <= endDate;
    });
    setFilteredEvents(filtered);
    setIsFiltering(true);
    setIsFilterModalVisible(false);
    setIsEndDateSelected(false);
    setIsStartDateSelected(false);
  };

  const onShowFilter: () => void = () => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> MapScreen -> onShowFilter",
    });
    setIsFilterModalVisible(true);
  };

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

  if (isLoading || events.length < 1) {
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

  const onShowDatePicker: (dateType: string) => void = (dateType: string) => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> NewEventScreen -> onShowDatePicker",
    });

    if (dateType === "startDate") {
      setSelectedDatepicker("start");
    } else {
      setSelectedDatepicker("end");
    }
    setShowDatepicker(true);
  };

  const onDateTimeChange: (
    _event: any,
    selectedValueDate: Date | undefined,
  ) => void = (_event: any, selectedValueDate: Date | undefined) => {
    if (_event.type === "dismissed") {
      setShowDatepicker(false);
      return;
    }
    if (selectedDatepicker === "end") {
      if (selectedValueDate && selectedValueDate < selectedStartDate) {
        Alert.alert("Error", "End date cannot be before start date");
        return;
      }
      if (selectedStartDate && selectedValueDate && isSameDay(selectedStartDate, selectedValueDate)) {
        Alert.alert("Error", "Start and end dates cannot be the same day");
        return;
      }
      else {
        setIsEndDateSelected(true);
        setSelectedEndDate(selectedValueDate);
      }

    } else {
      setIsStartDateSelected(true);
      setSelectedStartDate(selectedValueDate);
    }
    setSelectedDatepicker("");
    setShowDatepicker(false);
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const Map: () => JSX.Element = () => (
    <>
      <View style={styles.centered}>
        <View style={styles.filterIconContainer}>
          <TouchableOpacity
            onPress={onShowFilter}
            style={{
              backgroundColor:
                colorScheme === "dark"
                  ? Colors.dark.background
                  : Colors.light.background,
              padding: 10,
            }}
          >
            <MaterialIcons
              color={
                colorScheme === "dark"
                  ? Colors.dark.text
                  : Colors.light.text
              }
              name="filter-list"
              size={24}
            />
          </TouchableOpacity>
        </View>
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
          style={styles.map}>
          {/* TODO: After outsourcing/refactoring fetching the data in store adjust the markers after API will stop returning 402. */}
          {
            eventsOnMap.map((event: Event) => {
              return new Date().getTime() < new Date(event.date).getTime() ? (
                <Marker
                  coordinate={{
                    latitude: event.latitude ? event.latitude : 32.2332,
                    longitude: event.longitude ? event.longitude : 5.213,
                  }}
                  icon={
                    event.isUserEvent ?
                      require("../assets/images/icon-map-user-event.png") : require("../assets/images/icon-map-tamotam-event.png")
                  }
                  key={event.id}
                  onCalloutPress={() => saveEventHandler(event)} // For Android.
                  tracksViewChanges={false}>
                  <Callout
                    onPress={() => saveEventHandler(event)} // For iOS.
                    // TODO: The new styling for iOS isn"t good.
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
                    {
                      Platform.OS === "android" ?
                        (
                          <Text style={styles.imageWrapperAndroid}>
                            <Image
                              resizeMode="cover"
                              source={
                                event.imageUrl &&
                                  typeof event.imageUrl === "string"
                                  ? { uri: event.imageUrl }
                                  : require("../assets/images/no-image.jpeg")
                              }
                              style={styles.imageAndroid}
                            />
                          </Text>
                        ) : (
                          <Image
                            source={
                              event.imageUrl && typeof event.imageUrl === "string"
                                ? { uri: event.imageUrl }
                                : require("../assets/images/no-image.jpeg")
                            }
                            style={styles.imageIOS}
                          />
                        )
                    }
                    <StyledText style={styles.description}>
                      {
                        event.description
                          ? event.description
                          : "No information about description."
                      }
                    </StyledText>
                    <StyledText style={styles.description}>
                      🗓️{" "}
                      {new Date(event.date) instanceof Date
                        ? new Date(event.date).toLocaleDateString()
                        : "No information"}
                    </StyledText>
                    <StyledText style={styles.description}>
                      🕒{" "}
                      {
                        new Date(event.date) instanceof Date
                          ? new Date(event.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "No information"
                      }
                    </StyledText>
                    {
                      Platform.OS === "android" ? (
                        <StyledText
                          style={[
                            styles.saveButtonAndroid,
                            {
                              backgroundColor:
                                colorScheme === "dark"
                                  ? Colors.dark.text
                                  : Colors.light.text,
                              color:
                                colorScheme === "dark"
                                  ? Colors.dark.background
                                  : Colors.light.background,
                            },
                          ]}>
                          <MaterialIcons
                            color={
                              colorScheme === "dark"
                                ? Colors.dark.background
                                : Colors.light.background
                            }
                            name="check-circle-outline"
                            size={44}
                          />{" "}
                          SAVE
                        </StyledText>
                      ) : (
                        <Button
                          buttonColor={
                            colorScheme === "dark"
                              ? Colors.dark.text
                              : Colors.light.text
                          }
                          icon="check-circle-outline"
                          labelStyle={{ fontSize: 16 }}
                          mode="contained"
                          textColor={
                            colorScheme === "dark"
                              ? Colors.dark.background
                              : Colors.light.background
                          }>
                          Save
                        </Button>
                      )
                    }
                  </Callout>
                </Marker>
              ) : null;
            })
          }
        </MapView>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}>
        <View style={styles.centered}>
          <View style={[
            styles.modalContainer, {
              backgroundColor:
                colorScheme === "dark"
                  ? Colors.dark.background
                  : Colors.light.background,
            }]}>
            {showDatepicker == true && (
              <DateTimePicker
                style={{ width: "80%" }}
                display="spinner"
                is24Hour={true}
                maximumDate={
                  new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                }
                minimumDate={new Date()}
                mode={"date"}
                onChange={(event, value) => onDateTimeChange(event, value)}
                testID="dateTimePicker"
                textColor={
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text
                }
                value={selectedEndDate ? selectedEndDate : selectedStartDate} />
            )}
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={{ marginTop: 20 }}>
                <Button
                  buttonColor={colorScheme === "dark" ? Colors.dark.background : Colors.light.background}
                  icon="calendar-edit"
                  mode="text"
                  onPress={() => onShowDatePicker("startDate")}
                  textColor={colorScheme === "dark" ? Colors.dark.text : Colors.light.text}
                >
                  Pick start date
                </Button>
              </View>
              <StyledText>
                Start Date: {new Date(selectedStartDate).toLocaleDateString()}
              </StyledText>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <View style={{ marginTop: 20 }}>
                <Button
                  buttonColor={colorScheme === "dark" ? Colors.dark.background : Colors.light.background}
                  disabled={!isStartDateSelected}
                  icon="calendar-edit"
                  mode="text"
                  onPress={() => onShowDatePicker("endDate")}
                  textColor={colorScheme === "dark" ? Colors.dark.text : Colors.light.text}
                >
                  Pick end date
                </Button>
              </View>
              <StyledText>
                End Date: {new Date(selectedEndDate).toLocaleDateString()}
              </StyledText>
            </View>
            <View style={{ justifyContent: "space-evenly", flexDirection: "row", marginVertical: 40 }}>
              <Button
                buttonColor={
                  colorScheme === "dark"
                    ? Colors.dark.text
                    : Colors.light.text
                }
                disabled={!isEndDateSelected || !isStartDateSelected}
                mode="contained"
                onPress={onFilterDateEvents}
                style={{ marginRight: 5 }}
                textColor={
                  colorScheme === "dark" ? Colors.dark.background : Colors.light.background
                }
              >
                Filter
              </Button>
              <Button
                buttonColor={
                  colorScheme === "dark"
                    ? Colors.dark.background
                    : Colors.light.background
                }
                mode="outlined"
                onPress={onClearFilters}
                style={{ marginLeft: 5 }}
                textColor={
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text
                }
              >
                Clear
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );

  return <Map />;
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    backgroundColor: "transparent",
    flex: 1,
    justifyContent: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "justify",
  },
  filterIconContainer: {
    left: 20,
    position: "absolute",
    top: 20,
    zIndex: 999
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
    height: Platform.OS === "android" ? 400 : 340,
    padding: 10,
    shadowRadius: 15,
    width: Platform.OS === "android" ? 350 : 290,
  },
  map: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  modalContainer: {
    borderRadius: 50,
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  saveButtonAndroid: {
    fontSize: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
