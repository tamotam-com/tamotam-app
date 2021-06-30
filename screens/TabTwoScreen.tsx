import * as React from "react";
import MapView from "react-native-maps";
import { Button, Dimensions, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      {/* TODO: Generate custom map styles based on https://mapstyle.withgoogle.com with Retro theme. */}
      <MapView style={styles.map}>
        {/* TODO: Add Callout for events fetched from API's. */}
        <Marker
          coordinate={{ latitude: 51.23123, longitude: 4.921321 }}
          description="Description"
          title="Title"
        />
      </MapView>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button
        onPress={() => {
          alert("You tapped the button!");
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
