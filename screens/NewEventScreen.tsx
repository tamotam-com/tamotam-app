import * as Location from "expo-location";
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import CustomMapStyles from "../constants/CustomMapStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from "react";
import SelectImage from "../components/SelectImage";
import StyledText from "../components/StyledText";
import { addEvent } from "../store/actions/events";
import { useDispatch } from "react-redux";
import { useNetInfo, NetInfoState } from "@react-native-community/netinfo";
import {
  ActivityIndicator,
  Alert,
  ColorSchemeName,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Button, HelperText } from "react-native-paper";
import { Coordinate } from "../interfaces/coordinate";
import { Event } from "../interfaces/event";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Region } from "../interfaces/region";
import { View } from "../components/Themed";
// @ts-ignore
import { FIRESTORE_COLLECTION } from "@env";

export default function NewEventScreen({ navigation, route }: any) {
  const colorScheme: ColorSchemeName = useColorScheme();
  const dispatch: Dispatch<any> = useDispatch<Dispatch<any>>();
  const internetState: NetInfoState = useNetInfo();
  const mapRef: MutableRefObject<null> = useRef<null>(null);
  const [dateTimeError, setDateTimeError] = useState<string>("");
  const [dateTimeMode, setDateTimeMode] = useState<string | any>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [error, setError] = useState<Error>(new Error(""));
  const [imageUrlStorage, setImageUrlStorage] = useState("");
  const [initialRegionValue, setInitialRegionValue] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<any | Date>();
  const [selectedLocation, setSelectedLocation] = useState<Coordinate>({
    latitude: 0,
    longitude: 0,
  });
  const [showDatepicker, setShowDatepicker] = useState<boolean>(false);
  const [titleError, setTitleError] = useState<string>("");
  const [titleValue, setTitleValue] = useState<string>("");
  let markerCoordinates: Coordinate = { latitude: 0, longitude: 0 };

  useEffect(() => {
    if (error.message !== "") {
      Alert.alert(
        "Unknown Error ❌",
        "Please report this error by sending an email to us at feedback@tamotam.com. It will help us 🙏\nError details: " + error.message + "\nDate: " + new Date(),
        [{ text: "Okay" }]
      );
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> NewEventScreen -> useEffect[error], error: " + error,
      });
      crashlytics().recordError(error);
    }
  }, [error]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <Item
            color={
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
            }
            iconName={
              route.params && route.params.showIcon ? "arrow-back" : undefined
            }
            onPress={() => navigation.goBack()}
            title="back"
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const getUserLocationHandler: () => Promise<void> = useCallback(async () => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> NewEventScreen -> getUserLocationHandler",
    });
    setError(new Error(""));
    setIsLoading(true);

    if (Platform.OS !== "web") {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> NewEventScreen -> getUserLocationHandler, status: " + status,
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> NewEventScreen -> getUserLocationHandler, Platform.OS: " + Platform.OS,
      });
    }

    try {
      const location: Location.LocationObject = await Location.getCurrentPositionAsync({});

      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> NewEventScreen -> getUserLocationHandler -> try, location: " + location,
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
          description: "--- Analytics: screens -> NewEventScreen -> getUserLocationHandler -> catch, error: " + error,
        });
        crashlytics().recordError(error);
        setError(new Error(error.message));
      }
    } finally {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> NewEventScreen -> getUserLocationHandler -> finally",
      });
      setIsLoading(false);
    }
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> NewEventScreen -> useEffect[getUserLocationHandler]",
    });
    getUserLocationHandler();
  }, [getUserLocationHandler]);

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

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    };
  }

  const onDescriptionChange: (text: SetStateAction<string>) => void = (
    text: SetStateAction<string>
  ) => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> NewEventScreen -> onDescriptionChange, text: " + text,
    });
    setDescriptionValue(text);
  };

  const onDateTimeChange: (
    _event: any,
    selectedValueDate: Date | undefined
  ) => void = (_event: any, selectedValueDate: Date | undefined) => {
    if (!selectedDate) {
      setDateTimeError("Error: please select a date and time.");
    }

    if (_event.type === "dismissed") {
      setShowDatepicker(false);
      return;
    }

    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> NewEventScreen -> onDateTimeChange, _event: " + _event,
    });
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> NewEventScreen -> onDateTimeChange, selectedValueDate: " + selectedValueDate,
    });
    setDateTimeError("")
    setSelectedDate(selectedValueDate);
    setShowDatepicker(false);
  };

  const onLocationChange: (e: {
    nativeEvent: {
      coordinate: Coordinate;
    };
  }) => void = (e: { nativeEvent: { coordinate: Coordinate } }) => {
    if (selectedLocation.latitude === 0 || selectedLocation.longitude === 0) {
      setLocationError("Error: please select a location.");
    }

    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> NewEventScreen -> onLocationChange, e.nativeEvent.coordinate: " + e.nativeEvent.coordinate,
    });
    setLocationError("")
    setSelectedLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  };

  const onShowDatePicker: () => void = () => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> NewEventScreen -> onShowDatePicker",
    });
    showDateTimeMode("date");
  };

  const onShowTimePicker: () => void = () => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> NewEventScreen -> onShowTimePicker",
    });
    showDateTimeMode("time");
  };

  const onTitleChange: (text: SetStateAction<string>) => void = (
    text: SetStateAction<string>
  ) => {
    if (!titleValue.trim()) {
      setTitleError("Error: please enter a title.");
    }

    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> NewEventScreen -> onTitleChange, text: " + text,
    });
    setTitleError("")
    setTitleValue(text);
  };

  const showDateTimeMode: (currentMode: string) => void = (currentMode: string) => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> NewEventScreen -> showDateTimeMode, currentMode: " + currentMode,
    });
    setShowDatepicker(true);
    setDateTimeMode(currentMode);
  };

  const addEventHandler: () => Promise<void> = async () => {
    let firestoreDocumentIdResponse: string = "";

    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> NewEventScreen -> addEventHandler",
    });
    setError(new Error(""));
    setIsLoading(true);

    try {
      const newEvent: Event = {
        id: 'users' + Math.random() * 100000000000000000,
        date: selectedDate,
        description: descriptionValue,
        imageUrl: imageUrlStorage,
        isUserEvent: true,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        title: titleValue,
      };

      firestore()
        .collection(FIRESTORE_COLLECTION)
        .add(newEvent)
        .then((response) => {
          // @ts-ignore
          firestoreDocumentIdResponse = response._documentPath._parts[1];
          analytics().logEvent("custom_log", {
            description: "--- Analytics: screens -> NewEventScreen -> addEventHandler -> try -> then, newEvent: " + newEvent,
          });
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            analytics().logEvent("custom_log", {
              description: "--- Analytics: screens -> NewEventScreen -> addEventHandler -> try -> catch, error: " + error,
            });
            crashlytics().recordError(error);
            setError(new Error(error.message));
          }
        })
        .finally(async () => {
          dispatch(addEvent({
            ...newEvent,
            // Those 2 fields must be available only locally.
            firestoreDocumentId: firestoreDocumentIdResponse,
            imageUrl: imageUrlStorage ? await storage().ref(imageUrlStorage).getDownloadURL() : '',
          }));

          analytics().logEvent("custom_log", {
            description: "--- Analytics: screens -> NewEventScreen -> addEventHandler -> finally",
          });
        });
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ❌",
          "TamoTam couldn't create an event.\nTry one more time!",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: screens -> NewEventScreen -> addEventHandler -> catch, error: " + error,
        });
        crashlytics().recordError(error);
        setError(new Error(error.message));
      }
    } finally {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> NewEventScreen -> addEventHandler -> finally",
      });
      setIsLoading(false);
    }

    navigation.goBack();
  };

  const Map: () => JSX.Element = () => (
    <View style={styles.centered}>
      <MapView
        customMapStyle={CustomMapStyles.CUSTOM_MAP_STYLES}
        followsUserLocation={true}
        initialRegion={initialRegionValue}
        onPress={onLocationChange}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        showsUserLocation={true}
        style={styles.map}
      >
        {markerCoordinates && (
          <Marker
            coordinate={markerCoordinates}
            icon={require("../assets/images/icon-map-user-event.png")}
            tracksViewChanges={false}
            title="Picked Location"
          ></Marker>
        )}
      </MapView>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={[
        styles.screen,
        {
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        },
      ]}
    >
      <ScrollView>
        <Map />
        <View style={styles.form}>
          {locationError && <HelperText style={styles.error} type="error">{locationError}</HelperText>}
          <StyledText style={styles.label}>Title</StyledText>
          <TextInput
            style={[
              styles.textInput,
              {
                color:
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
              },
            ]}
            onChangeText={onTitleChange}
            value={titleValue}
          />
          {titleError && <HelperText style={[styles.error, { marginTop: -15 }]} type="error">{titleError}</HelperText>}
          <StyledText style={styles.label}>Description</StyledText>
          <TextInput
            style={[
              styles.textInput,
              {
                color:
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
              },
            ]}
            onChangeText={onDescriptionChange}
            value={descriptionValue}
          />
          <View style={styles.dateTimeButtonsContainer}>
            <View>
              <Button
                buttonColor={
                  colorScheme === "dark"
                    ? Colors.dark.background
                    : Colors.light.background
                }
                icon="calendar-edit"
                mode="text"
                onPress={onShowDatePicker}
                textColor={
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text
                }
              >
                Pick date
              </Button>
            </View>
            <View>
              <Button
                buttonColor={
                  colorScheme === "dark"
                    ? Colors.dark.background
                    : Colors.light.background
                }
                icon="clock-outline"
                mode="text"
                onPress={onShowTimePicker}
                textColor={
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text
                }
              >
                Pick time
              </Button>
            </View>
          </View>
          {showDatepicker && (
            <DateTimePicker
              display="spinner"
              is24Hour={true}
              maximumDate={
                new Date(new Date().setFullYear(new Date().getFullYear() + 1))
              }
              minimumDate={new Date()}
              mode={dateTimeMode}
              onChange={onDateTimeChange}
              testID="dateTimePicker"
              textColor={
                colorScheme === "dark" ? Colors.dark.text : Colors.light.text
              }
              value={selectedDate || new Date()}
            />
          )}
          {selectedDate &&
            <View style={styles.centered}>
              <StyledText>Date: {new Date(selectedDate).toLocaleDateString()}</StyledText>
              <StyledText>Time: {new Date(selectedDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}</StyledText>
            </View>
          }
          {dateTimeError && <HelperText style={[styles.error, { marginTop: -30 }]} type="error">{dateTimeError}</HelperText>}
          <SelectImage imageUrlStorageFromChild={setImageUrlStorage} />
          <Button
            buttonColor={
              colorScheme === "dark"
                ? Colors.dark.text
                : Colors.light.text
            }
            disabled={!titleValue.trim() || !selectedDate || selectedLocation.latitude === 0 || selectedLocation.longitude === 0}
            icon="plus-box"
            mode={!titleValue.trim() || !selectedDate || selectedLocation.latitude === 0 || selectedLocation.longitude === 0 ? "contained" : "text"}
            onPress={addEventHandler}
            style={[styles.addEventButton, { borderColor: colorScheme === "dark" ? "#ffffff" : "#000000" },]}
            textColor={
              colorScheme === "dark" ? Colors.dark.background : Colors.light.background
            }
          >
            Add Event
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  addEventButton: {
    borderRadius: 50,
    marginBottom: 50,
  },
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  dateTimeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  form: {
    marginHorizontal: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
  },
  map: {
    height: Dimensions.get("window").height / 2,
    width: Dimensions.get("window").width,
  },
  screen: {
    flex: 1,
  },
  textInput: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
});
