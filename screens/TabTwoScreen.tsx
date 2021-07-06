import * as Localization from "expo-localization";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MapView from "react-native-maps";
import { Dimensions, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import {
  PREDICTHQ_ACCESS_TOKEN,
  PREDICTHQ_CATEGORIES,
  PREDICTHQ_LIMIT,
} from "@env";
import { Text, View } from "../components/Themed";

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

export default function TabTwoScreen() {
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
