import * as Location from "expo-location";
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import CustomMapStyles from "../constants/CustomMapStyles";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import SelectImage from "../components/SelectImage";
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
import StyledText from "../components/StyledText";
import { updateEvent } from "../store/actions/events";
import { useDispatch, useSelector } from "react-redux";
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
import { Button } from "react-native-paper";
import { Coordinate } from "../interfaces/coordinate";
import { Event } from "../interfaces/event";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Region } from "../interfaces/region";
import { View } from "../components/Themed";

export default function EditEventScreen({ navigation, route }: any) {
  const colorScheme: ColorSchemeName = useColorScheme();
  const dispatch: Dispatch<any> = useDispatch<Dispatch<any>>();
  const eventId: number = route.params.eventId;
  const internetState: NetInfoState = useNetInfo();
  const mapRef: MutableRefObject<null> = useRef<null>(null);
  const selectedEvent: Event = useSelector<any, any>((state: any) =>
    state.events.savedEvents.find((event: Event) => event.id === eventId)
  );
  const [dateTimeMode, setDateTimeMode] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [error, setError] = useState<Error>(new Error());
  const [initialRegionValue, setInitialRegionValue] = useState<Region>({
    latitude: selectedEvent.latitude,
    longitude: selectedEvent.longitude,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<any | Date>(
    isNaN(Number(selectedEvent.date))
      ? new Date()
      : new Date(Number(selectedEvent.date))
  );
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<Coordinate>();
  const [showDatepicker, setShowDatepicker] = useState<boolean>(false);
  const [titleValue, setTitleValue] = useState<string>("");
  let markerCoordinates: Coordinate = {
    latitude: selectedEvent.latitude,
    longitude: selectedEvent.longitude,
  };

  useEffect(() => {
    if (error.message !== "") {
      Alert.alert(
        "Unknown Error ❌",
        "Please report this error by sending an email to us at feedback@tamotam.com. It will help us 🙏\nError details: " + error.message + "\nDate: " + new Date(),
        [{ text: "Okay" }]
      );
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> EditEventScreen -> useEffect[error], error: " + error,
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
      description: "--- Analytics: screens -> EditEventScreen -> getUserLocationHandler",
    });
    setError(new Error(""));
    setIsLoading(true);

    if (Platform.OS !== "web") {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> EditEventScreen -> getUserLocationHandler, status: " + status,
      });
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> EditEventScreen -> getUserLocationHandler, Platform.OS: " + Platform.OS,
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
        description: "--- Analytics: screens -> EditEventScreen -> getUserLocationHandler -> try, location: " + location,
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
          description: "--- Analytics: screens -> EditEventScreen -> getUserLocationHandler -> catch, error: " + error,
        });
        crashlytics().recordError(error);
        setError(new Error(error.message));
      }
    } finally {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> EditEventScreen -> getUserLocationHandler -> finally",
      });
      setIsLoading(false);
    }
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> EditEventScreen -> useEffect[getUserLocationHandler]",
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
      description: "--- Analytics: screens -> EditEventScreen -> onDescriptionChange, text: " + text,
    });
    setDescriptionValue(text);
  };

  const onDateTimeChange: (
    _event: any,
    selectedValueDate: Date | undefined
  ) => void = (_event: any, selectedValueDate: Date | undefined) => {
    if (_event.type === "dismissed") {
      setShowDatepicker(false);
      return;
    }

    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> EditEventScreen -> onDateTimeChange, _event: " + _event,
    });
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> EditEventScreen -> onDateTimeChange, selectedValueDate: " + selectedValueDate,
    });
    setSelectedDate(selectedValueDate);
    setShowDatepicker(false);
  };

  const onImageChange: (imagePath: string) => void = (imagePath: string) => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> EditEventScreen -> onImageChange, imagePath: " + imagePath,
    });
    setSelectedImage(imagePath);
  };

  const onLocationChange: (e: {
    nativeEvent: {
      coordinate: Coordinate;
    };
  }) => void = (e: { nativeEvent: { coordinate: Coordinate } }) => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> EditEventScreen -> onLocationChange, e.nativeEvent.coordinate: " + e.nativeEvent.coordinate,
    });
    setSelectedLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  };

  const onShowDatePicker: () => void = () => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> EditEventScreen -> onShowDatePicker, text: ",
    });
    showDateTimeMode("date");
  };

  const onShowTimePicker: () => void = () => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> EditEventScreen -> onShowTimePicker, text: ",
    });
    showDateTimeMode("time");
  };

  const onTitleChange: (text: SetStateAction<string>) => void = (
    text: SetStateAction<string>
  ) => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> EditEventScreen -> onTitleChange, text: " + text,
    });
    setTitleValue(text);
  };

  const showDateTimeMode: (currentMode: string) => void = (currentMode: string) => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> EditEventScreen -> showDateTimeMode, currentMode: " + currentMode,
    });
    setShowDatepicker(true);
    setDateTimeMode(currentMode);
  };

  const onSaveHandler: () => void = () => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> EditEventScreen -> onSaveHandler",
    });
    setError(new Error(""));
    setIsLoading(true);

    try {
      const newEvent: Event = {
        id: eventId,
        date: selectedDate,
        description: descriptionValue
          ? descriptionValue
          : selectedEvent.description,
        imageUrl: selectedImage ? selectedImage : selectedEvent.imageUrl,
        isUserEvent: selectedEvent.isUserEvent,
        latitude: markerCoordinates.latitude ? markerCoordinates.latitude : 0,
        longitude: markerCoordinates.longitude ? markerCoordinates.longitude : 0,
        title: titleValue ? titleValue : selectedEvent.title,
      };

      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> EditEventScreen -> onSaveHandler -> try, newEvent: " + newEvent,
      });
      dispatch(updateEvent(newEvent));
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ❌",
          "TamoTam couldn't save the changes.\nTry one more time!",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: screens -> EditEventScreen -> onSaveHandler -> catch, error: " + error,
        });
        crashlytics().recordError(error);
        setError(new Error(error.message));
      }
    } finally {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> EditEventScreen -> onSaveHandler -> finally",
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
            icon={selectedEvent.isUserEvent ? require("../assets/images/icon-map-user-event.png") : require("../assets/images/icon-map-tamotam-event.png")}
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
        {!selectedEvent.latitude || !selectedEvent.longitude ?
          <View style={styles.centered}>
            <StyledText style={styles.title}>
              Problem with obtaining coordinates.
            </StyledText>
          </View> :
          <Map />
        }
        <View style={styles.form}>
          <StyledText style={styles.label}>Title</StyledText>
          <TextInput
            defaultValue={selectedEvent ? selectedEvent.title : ""}
            onChangeText={onTitleChange}
            style={[
              styles.textInput,
              {
                color:
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
              },
            ]}
          />
          <StyledText style={styles.label}>Description</StyledText>
          <TextInput
            defaultValue={selectedEvent ? selectedEvent.description : ""}
            onChangeText={onDescriptionChange}
            style={[
              styles.textInput,
              {
                color:
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
              },
            ]}
          />
          <View style={styles.dateTimeButtonsContainer}>
            <View>
              <Button
                color={
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text
                }
                icon="calendar-edit"
                mode="text"
                onPress={onShowDatePicker}
              >
                Pick date
              </Button>
            </View>
            <View>
              <Button
                color={
                  colorScheme === "dark" ? Colors.dark.text : Colors.light.text
                }
                icon="clock-outline"
                mode="text"
                onPress={onShowTimePicker}
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
              value={selectedDate}
            />
          )}
          <View style={styles.centered}>
            <StyledText>Date: {new Date(selectedDate).toLocaleDateString()}</StyledText>
            <StyledText>Time: {new Date(selectedDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}</StyledText>
          </View>
          <SelectImage
            existingImageUrl={
              selectedEvent.imageUrl && typeof selectedEvent.imageUrl === "string"
                ? selectedEvent.imageUrl
                : require("../assets/images/no-image.jpeg")
            }
            onImageTaken={onImageChange}
          />
          <Button
            color={
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
            }
            icon="check-circle-outline"
            onPress={onSaveHandler}
          >
            Save
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
});
