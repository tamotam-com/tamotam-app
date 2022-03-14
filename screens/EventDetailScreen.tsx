import getAddressFromCoordinate from "../common/getAddressFromCoordinate";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import MapView, { Marker } from "react-native-maps";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React, { useLayoutEffect, useRef, MutableRefObject } from "react";
import StyledText from "../components/StyledText";
import { useSelector } from "react-redux";
import { Coordinate } from "../interfaces/coordinate";
import { Dimensions, Image, ScrollView, StyleSheet } from "react-native";
import { Event } from "../interfaces/event";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { View } from "../components/Themed";

export default function PlaceDetailScreen({ navigation, route }: any) {
  const colorScheme: "light" | "dark" = useColorScheme();
  const eventId: number = route.params.eventId;
  const mapRef: MutableRefObject<null> = useRef<null>(null);
  const savedEvents: Event[] = useSelector(
    (state: any) => state.events.savedEvents
  );
  const selectedEvent: Event = useSelector((state: any) =>
    state.events.savedEvents.find((event: Event) => event.id === eventId)
  );
  let markerCoordinates: Coordinate = {
    latitude: selectedEvent.coordinate.latitude,
    longitude: selectedEvent.coordinate.longitude,
  };

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

  if (savedEvents.length === 0 || !savedEvents) {
    return (
      <View style={styles.container}>
        <StyledText style={styles.title}>
          No saved events found. Start adding some!
        </StyledText>
      </View>
    );
  }

  const Map: () => JSX.Element = () => (
    <View style={styles.container}>
      <MapView
        onRegionChange={async (region) =>
          await getAddressFromCoordinate(mapRef, region)
        }
        ref={mapRef}
        style={styles.map}
      >
        {markerCoordinates && (
          <Marker
            coordinate={markerCoordinates}
            title="Event's Location"
          ></Marker>
        )}
      </MapView>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <StyledText style={styles.title}>{selectedEvent.title}</StyledText>
        <StyledText style={styles.description}>
          {selectedEvent.description}
        </StyledText>
        <StyledText style={styles.description}>
          🗓️ {selectedEvent.date.toLocaleDateString()}
        </StyledText>
        <StyledText style={styles.description}>
          🕒{" "}
          {selectedEvent.date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </StyledText>
        <Image
          source={
            selectedEvent.imageUrl === ""
              ? require("../assets/images/no-image.jpeg")
              : selectedEvent.imageUrl
          }
          style={styles.image}
        />
        <Map />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  description: {
    marginBottom: 10,
  },
  image: {
    alignItems: "center",
    borderColor: "#ccc",
    borderRadius: 10,
    borderWidth: 1,
    height: 200,
    justifyContent: "center",
    width: "100%",
  },
  map: {
    height: Dimensions.get("window").height / 2,
    marginTop: 30,
    width: Dimensions.get("window").width,
  },
  title: {
    fontSize: 20,
    marginVertical: 15,
    textAlign: "center",
  },
});
