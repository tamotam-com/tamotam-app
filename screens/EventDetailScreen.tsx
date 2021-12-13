import getAddressFromCoordinate from "../common/getAddressFromCoordinate";
import useColorScheme from "../hooks/useColorScheme";
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

  const savedEvents = useSelector((state: any) => state.events.savedEvents);

  if (savedEvents.length === 0 || !savedEvents) {
    return (
      <View style={styles.content}>
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
            title="Picked Location"
            coordinate={markerCoordinates}
          ></Marker>
        )}
      </MapView>
    </View>
  );

  return (
    <ScrollView>
      <Image source={{ uri: selectedEvent.imageUrl }} style={styles.image} />
      <Map />
      <View style={styles.container}>
        <StyledText>Title: {selectedEvent.title}</StyledText>
        <StyledText>Description: {selectedEvent.description}</StyledText>
        <StyledText>
          Adress: {selectedEvent.coordinate.latitude},{" "}
          {selectedEvent.coordinate.longitude}
        </StyledText>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    backgroundColor: "#ccc",
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  map: {
    height: Dimensions.get("window").height / 2,
    width: Dimensions.get("window").width,
  },
  title: {
    textAlign: "center",
  },
});
