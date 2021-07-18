import * as Localization from "expo-localization";
import { toggleFavorite } from "../store/actions/events";
import { useDispatch } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import MapView from "react-native-maps";
import { Dimensions, StyleSheet } from "react-native";
import {
  HeaderButton,
  HeaderButtons,
  HeaderButtonProps,
  Item,
} from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";
import { Marker } from "react-native-maps";
import {
  PREDICTHQ_ACCESS_TOKEN,
  PREDICTHQ_CATEGORIES,
  PREDICTHQ_LIMIT,
} from "@env";
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
  const [markers, setMarkers] = useState(null);

  useEffect(() => {
    axios({
      method: "GET",
      url: "https://api.predicthq.com/v1/events/",
      headers: {
        Authorization: `Bearer ${PREDICTHQ_ACCESS_TOKEN}`,
        Accept: "application/json",
      },
      params: {
        category: PREDICTHQ_CATEGORIES,
        country: Localization.region,
        limit: PREDICTHQ_LIMIT,
      },
    })
      .then((response) => {
        setMarkers(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // "[]" makes sure the effect will run only once.

  // TODO: Make adding favorites working.
  const dispatch = useDispatch();

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
        {markers &&
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
          ))}
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
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
