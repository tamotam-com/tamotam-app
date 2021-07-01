import React, { useEffect, useState } from "react";
import axios from "axios";
import MapView from "react-native-maps";
import { Button, Dimensions, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { PREDICTHQ_ACCESS_TOKEN, PREDICTHQ_CATEGORIES } from "@env";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

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
      <MapView style={styles.map}>
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
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button
        onPress={() => {
          alert("test");
        }}
        title="Press Me"
      />
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
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
    height: Dimensions.get("window").height - 400,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
