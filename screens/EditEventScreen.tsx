import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React, { useEffect, useRef, useState } from "react";
import getAddressFromCoordinate from "../common/getAddressFromCoordinate";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import MapView, { Marker } from "react-native-maps";
import StyledText from "../components/StyledText";
import { updateEvent } from "../store/actions/events";
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
import { Text, View } from "../components/Themed";

export default function EditEventScreen({ navigation, route }: any) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const eventId: number = route.params.eventId;
  const mapRef = useRef(null);
  const selectedEvent: Event = useSelector((state: any) =>
    state.events.savedEvents.find((event: Event) => event.id === eventId)
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <Item
            color={colorScheme === "dark" ? "#ffbfbf" : "#b30000"}
            iconName={
              route.params && route.params.showIcon ? "arrow-back" : undefined
            }
            onPress={() => {
              navigation.goBack();
            }}
            title="back"
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const [descriptionValue, setDescriptionValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [titleValue, setTitleValue] = useState("");

  const descriptionChangeHandler = (text: React.SetStateAction<string>) => {
    setDescriptionValue(text);
  };
  const selectLocationHandler = (e: {
    nativeEvent: { coordinate: Coordinate };
  }) => {
    setSelectedLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  };
  const titleChangeHandler = (text: React.SetStateAction<string>) => {
    setTitleValue(text);
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const onSaveHandler = () => {
    setError("");
    setIsLoading(true);

    try {
      const newEvent: Event = {
        id: eventId,
        coordinate: {
          latitude: markerCoordinates.latitude,
          longitude: markerCoordinates.longitude,
        },
        description: descriptionValue
          ? descriptionValue
          : selectedEvent.description,
        imageUrl: "https://picsum.photos/700",
        title: titleValue ? titleValue : selectedEvent.title,
      };
      dispatch(updateEvent(newEvent));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }

    navigation.goBack();
    setIsLoading(false);
  };

  let markerCoordinates: Coordinate = {
    latitude: selectedEvent.coordinate.latitude,
    longitude: selectedEvent.coordinate.longitude,
  };

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    };
  }

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
        onPress={selectLocationHandler}
        onLongPress={async (e) => await getAddressFromCoordinate(e)}
        ref={mapRef}
        style={styles.map}
      >
        {markerCoordinates && (
          <Marker
            title="Picked Location"
            coordinate={markerCoordinates}
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
        { backgroundColor: colorScheme === "dark" ? "#000000" : "#ffffff" },
      ]}
    >
      <ScrollView>
        <Map />
        <View style={styles.form}>
          <StyledText style={styles.label}>Title</StyledText>
          <TextInput
            defaultValue={selectedEvent ? selectedEvent.title : ""}
            style={[
              styles.textInput,
              { color: colorScheme === "dark" ? "#ffffff" : "#000000" },
            ]}
            onChangeText={titleChangeHandler}
          />
          <StyledText style={styles.label}>Description</StyledText>
          <TextInput
            defaultValue={selectedEvent ? selectedEvent.description : ""}
            style={[
              styles.textInput,
              { color: colorScheme === "dark" ? "#ffffff" : "#000000" },
            ]}
            onChangeText={descriptionChangeHandler}
          />
          <Button
            color={colorScheme === "dark" ? "#ffbfbf" : "#b30000"}
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
  container: {
    flex: 1,
    alignItems: "center",
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
