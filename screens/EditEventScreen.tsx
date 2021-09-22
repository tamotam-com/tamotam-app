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
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
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
  // const editedEvent = useSelector((state) =>
  //   state.events.savedEvents.find((event: Event) => event.id === 2)
  // );
  const editedEvent = useSelector((state) => state.events.savedEvents);
  const [error, setError] = useState();
  const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
  const formReducer = (
    state: { inputValues: any },
    action: { type: string; input: any; value: any }
  ) => {
    if (action.type === FORM_INPUT_UPDATE) {
      const updatedValues: any = {
        ...state.inputValues,
        [action.input]: action.value,
      };
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
            onPress={() => navigation.goBack()}
            title="back"
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      description: editedEvent[0] ? editedEvent[0].description : "",
      title: editedEvent[0] ? editedEvent[0].title : "",
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

  const onSaveHandler = () => {
    const newEvent: Event = {
      id: 2,
      coordinate: {
        latitude: 41.2,
        longitude: 2.0,
      },
      description: descriptionValue,
      title: titleValue,
    };

    dispatch(updateEvent(newEvent));
    navigation.goBack();
  };

  const selectLocationHandler = (e: { nativeEvent: { coordinate: any } }) => {
    const event: Event = {
      id: 2,
      coordinate: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      },
      description: "dynamic test",
      title: "dynamic title",
    };
    dispatch(addEvent(event));

    setSelectedLocation({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  };

  let markerCoordinates: Coordinate = { latitude: 0, longitude: 0 };

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
    <ScrollView>
      <View style={styles.form}>
        <StyledText style={styles.label}>Title</StyledText>
        <TextInput
          style={styles.textInput}
          onChangeText={titleChangeHandler}
          value={editedEvent[0] ? editedEvent[0].title : titleValue}
        />
        <StyledText style={styles.label}>Description</StyledText>
        <TextInput
          style={styles.textInput}
          onChangeText={descriptionChangeHandler}
          value={editedEvent[0] ? editedEvent[0].description : descriptionValue}
        />
        <Button title="Save" onPress={onSaveHandler} />
      </View>
      <Map />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    margin: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
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
