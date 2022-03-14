import analytics from "@react-native-firebase/analytics";
import firestore from "@react-native-firebase/firestore";
import getAddressFromCoordinate from "../common/getAddressFromCoordinate";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React, {
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
import { useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Button } from "react-native-paper";
import { Coordinate } from "../interfaces/coordinate";
import { Event } from "../interfaces/event";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { View } from "../components/Themed";
// @ts-ignore
import { FIRESTORE_COLLECTION } from "@env";

export default function NewEventScreen({ navigation, route }: any) {
  const colorScheme: "light" | "dark" = useColorScheme();
  const dispatch: Dispatch<any> = useDispatch<Dispatch<any>>();
  const mapRef: MutableRefObject<null> = useRef<null>(null);
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<any | Date>(new Date());
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<Coordinate>({
    latitude: 0,
    longitude: 0,
  });
  const [titleValue, setTitleValue] = useState<string>("");
  let markerCoordinates: Coordinate = { latitude: 0, longitude: 0 };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
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

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    };
  }

  const onDescriptionChange: (text: SetStateAction<string>) => void = (
    text: SetStateAction<string>
  ) => {
    setDescriptionValue(text);
  };

  const onDateChange: (
    _event: any,
    selectedValueDate: Date | undefined
  ) => void = (_event: any, selectedValueDate: Date | undefined) => {
    setSelectedDate(selectedValueDate);
  };

  const onImageChange: (imagePath: string) => void = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const onLocationChange: (e: {
    nativeEvent: {
      coordinate: Coordinate;
    };
  }) => void = (e: { nativeEvent: { coordinate: Coordinate } }) => {
    setSelectedLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  };

  const onTitleChange: (text: SetStateAction<string>) => void = (
    text: SetStateAction<string>
  ) => {
    setTitleValue(text);
  };

  const addEventHandler: () => Promise<void> = async () => {
    setError("");
    setIsLoading(true);

    try {
      const newEvent: Event = {
        id: Math.random() * 100000000000000000,
        coordinate: {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
        date: selectedDate,
        description: descriptionValue,
        imageUrl: selectedImage,
        title: titleValue,
      };

      firestore()
        .collection(FIRESTORE_COLLECTION)
        .add(newEvent)
        .then(() => {
          analytics().logEvent("User's event added: ", newEvent);
        })
        .catch(() => {
          analytics().logEvent("Problem with adding user's event: ", newEvent);
        })
        .finally(() => {
          analytics().logEvent(
            `Firestore ${FIRESTORE_COLLECTION} stopped executing`
          );
        });
      dispatch(addEvent(newEvent));
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(
          "An error occurred ❌",
          "TamoTam couldn't create an event.\nTry one more time!",
          [{ text: "Okay" }]
        );

        setError(err.message);
      }
    }

    navigation.goBack();
    setIsLoading(false);
  };

  const Map: () => JSX.Element = () => (
    <View style={styles.container}>
      <MapView
        onPress={onLocationChange}
        onRegionChange={async (region) =>
          await getAddressFromCoordinate(mapRef, region)
        }
        ref={mapRef}
        style={styles.map}
      >
        {markerCoordinates && (
          <Marker
            coordinate={markerCoordinates}
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
          <DateTimePicker
            display="spinner"
            maximumDate={
              new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            }
            minimumDate={new Date()}
            mode="date"
            onChange={onDateChange}
            testID="datePicker"
            textColor={
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
            }
            value={selectedDate}
          />
          <DateTimePicker
            display="spinner"
            mode="time"
            onChange={onDateChange}
            testID="timePicker"
            textColor={
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
            }
            value={selectedDate}
          />
          <SelectImage onImageTaken={onImageChange} />
          <Button
            color={
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
            }
            icon="plus-box"
            mode="outlined"
            onPress={addEventHandler}
            style={styles.addEventButton}
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
    borderColor: "#ffffff",
    borderRadius: 50,
    marginBottom: 50,
  },
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
});
