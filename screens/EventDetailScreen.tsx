import getAddressFromCoordinate from "../common/getAddressFromCoordinate";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import MapView, { Marker } from "react-native-maps";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React, { useRef } from "react";
import StyledText from "../components/StyledText";
import { useSelector } from "react-redux";
import { Coordinate } from "../interfaces/coordinate";
import { Dimensions, Image, ScrollView, StyleSheet } from "react-native";
import { Event } from "../interfaces/event";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Text, View } from "../components/Themed";

export default function PlaceDetailScreen({ navigation, route }: any) {
  const colorScheme = useColorScheme();
  const eventId: number = route.params.eventId;
  const mapRef = useRef(null);
  const selectedEvent: Event = useSelector((state: any) =>
    state.events.savedEvents.find((event: Event) => event.id === eventId)
  );

  React.useLayoutEffect(() => {
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

  const savedEvents = useSelector((state: any) => state.events.savedEvents);

  if (savedEvents.length === 0 || !savedEvents) {
    return (
      <View style={styles.container}>
        <StyledText style={styles.title}>
          No saved events found. Start adding some!
        </StyledText>
      </View>
    );
  }

  let markerCoordinates: Coordinate = {
    latitude: selectedEvent.coordinate.latitude,
    longitude: selectedEvent.coordinate.longitude,
  };

  const Map = () => (
    <View style={styles.container}>
      {/* TODO: Generate custom map styles based on https://mapstyle.withgoogle.com with Retro theme. */}
      <MapView
        onLongPress={async (e) => await getAddressFromCoordinate(e)}
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
        <Image source={{ uri: selectedEvent.imageUrl }} style={styles.image} />
        <Map />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    margin: 10,
  },
  image: {
    backgroundColor: "#ccc",
    height: 150,
    width: "50%",
  },
  map: {
    height: Dimensions.get("window").height / 2,
    marginTop: 35,
    width: Dimensions.get("window").width,
  },
  title: {
    fontSize: 20,
    margin: 10,
    textAlign: "center",
  },
});
