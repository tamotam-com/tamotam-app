import * as eventsActions from "../store/actions/events";
import { toggleFavorite } from "../store/actions/events";
import { useDispatch } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import MapView, { Callout } from "react-native-maps";
import { Alert, Button, Dimensions, StyleSheet } from "react-native";
import {
  HeaderButton,
  HeaderButtons,
  HeaderButtonProps,
  Item,
} from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";
import { Marker } from "react-native-maps";
import { Text, View } from "../components/Themed";

const MaterialHeaderButton = (
  props: JSX.IntrinsicAttributes &
    JSX.IntrinsicClassAttributes<HeaderButton> &
    Readonly<HeaderButtonProps> &
    Readonly<{ children?: React.ReactNode }>
) => {
  // the `props` here come from <Item ... />
  // you may access them and pass something else to `HeaderButton` if you like
  return (
    <HeaderButton
      IconComponent={MaterialIcons}
      iconSize={23}
      // you can customize the colors, by default colors from react navigation theme will be used
      // color="red"
      // pressColor="blue"
      {...props}
    />
  );
};

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

export default function TabTwoScreen({ navigation }) {
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState(null);
  const dispatch = useDispatch();

  const loadEvents = useCallback(async () => {
    setError(null);
    try {
      await dispatch(eventsActions.fetchEvents());
    } catch (error) {
      Alert.alert(
        "An error occurred ❌",
        "We couldn't load events, sorry.\nTry to reload tamotam!",
        [{ text: "Okay" }]
      );
      setError(error.message);
    }
  }, [dispatch, setError]);

  useEffect(() => {
    loadEvents();
    console.log(loadEvents);
  }, []);

  // TODO: Make adding favorites working.
  const toggleFavoriteHandler = useCallback(() => {
    dispatchEvent(toggleFavorite());
  }, [dispatch]);

  // useEffect(() => {
  //   navigation.setParam({ toggleFav: toggleFavoriteHandler });
  // }, [toggleFavoriteHandler]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <Item
            title="Menu"
            iconName="ios-menu"
            onPress={() => {
              alert("toggle favorites");
            }}
          />
        </HeaderButtons>
      ),
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      {/* TODO: Generate custom map styles based on https://mapstyle.withgoogle.com with Retro theme. */}
      <MapView
        ref={(ref) => (this.mapRef = ref)}
        onRegionChange={async (e) => await onRegionChange()}
        style={styles.map}
      >
        {/* TODO: Add Callout for events fetched from API's. */}
        {/* TODO: After outsourcing/refactoring fetching the data in store adjust the markers after API will stop returning 402. */}
        {/* TODO: Uncomment this once access to the API will be back. */}
        {/* {markers &&
          markers.map((marker: any, index: number) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.location[1],
                longitude: marker.location[0],
              }}
              title={marker.title}
              description={marker.description}
            />
          ))} */}
        <Marker
          coordinate={{ latitude: 51.23123, longitude: 4.921321 }}
          description="Description"
          title="Title"
        >
          <Callout style={styles.locationButtonCallout}>
            <Button
              onPress={() => alert("button hello")}
              title={"Callout Button"}
            />
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  locationButtonCallout: {
    borderRadius: 0,
    opacity: 0.8,
    backgroundColor: "lightgrey",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
