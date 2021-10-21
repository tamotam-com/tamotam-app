import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React, { useCallback, useReducer, useState } from "react";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import MapView, { Marker } from "react-native-maps";
import StyledText from "../components/StyledText";
import { updateEvent } from "../store/actions/events";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Coordinate } from "../interfaces/coordinate";
import { Event } from "../interfaces/event";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Text, View } from "../components/Themed";

// TODO: This method multiplies across components.
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

export default function EditEventScreen({ navigation, route }: any) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const eventId: number = route.params.eventId;
  const selectedEvent: Event = useSelector((state: any) =>
    state.events.savedEvents.find((event: Event) => event.id === eventId)
  );
  const [error, setError] = useState();
  const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
  // TODO: Fix the formReducer after fixing 1 letter input and clean up the code...
  const formReducer = (
    state: { inputValues: any },
    action: { input: any; type: string; value: any }
  ) => {
    if (action.type === FORM_INPUT_UPDATE) {
      const updatedValues: any = {
        ...state.inputValues,
        title: action.input,
      };
      console.log("============== form Reducer");
      console.log("updatedValues", updatedValues);
      console.log("action", action);
      return {
        inputValues: updatedValues,
      };
    }
    return state;
  };

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
              console.log("description", formState.inputValues.description);
              console.log("title", formState.inputValues.title);
            }}
            title="back"
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      description: selectedEvent ? selectedEvent.description : "",
      latitude: selectedEvent ? selectedEvent.coordinate.latitude : "",
      longitude: selectedEvent ? selectedEvent.coordinate.longitude : "",
      title: selectedEvent ? selectedEvent.title : "",
    },
  });

  const [descriptionValue, setDescriptionValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [titleValue, setTitleValue] = useState("");

  const descriptionChangeHandler = (text: React.SetStateAction<string>) => {
    setDescriptionValue(text);
  };
  const titleChangeHandler = (text: React.SetStateAction<string>) => {
    setTitleValue(text);
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue) => {
      dispatchFormState({
        input: inputIdentifier,
        type: FORM_INPUT_UPDATE,
        value: inputValue,
      });
    },
    [dispatchFormState]
  );

  const onSaveHandler = useCallback(async () => {
    const newEvent: Event = {
      id: eventId,
      coordinate: {
        latitude: +formState.inputValues.latitude,
        longitude: +formState.inputValues.longitude,
      },
      description: formState.inputValues.description,
      title: formState.inputValues.title,
    };
    console.log("HOP", newEvent);
    console.log("FORM STATE", formState);
    console.log("description", formState.inputValues.description);
    console.log("title", formState.inputValues.title);

    await dispatch(updateEvent(newEvent));
    navigation.goBack();
  }, [dispatch, eventId, formState]);

  const selectLocationHandler = (e: { nativeEvent: { coordinate: any } }) => {
    const event: Event = {
      id: eventId,
      coordinate: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      },
      description: selectedEvent.description,
      title: selectedEvent.title,
    };
    dispatch(updateEvent(event));

    setSelectedLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
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

  const Map = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Map</Text>
      {/* TODO: Generate custom map styles based on https://mapstyle.withgoogle.com with Retro theme. */}
      <MapView
        ref={(ref) => (this.mapRef = ref)}
        onPress={selectLocationHandler}
        onRegionChange={async (e) => await onRegionChange()}
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
    <KeyboardAvoidingView behavior="position" style={styles.screen}>
      <ScrollView>
        <Map />
        <View style={styles.form}>
          <StyledText style={styles.label}>Title</StyledText>
          <TextInput
            style={styles.textInput}
            onChangeText={inputChangeHandler}
            value={selectedEvent ? selectedEvent.title : ""}
          />
          <StyledText style={styles.label}>Description</StyledText>
          <TextInput
            style={styles.textInput}
            onChangeText={inputChangeHandler}
            value={selectedEvent ? selectedEvent.description : ""}
          />
          <Button title="Save" onPress={onSaveHandler} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
