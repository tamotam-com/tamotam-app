import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import CustomMapStyles from "../constants/CustomMapStyles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React, { useLayoutEffect, useRef, MutableRefObject, useEffect } from "react";
import StyledText from "../components/StyledText";
import { useNetInfo, NetInfoState } from "@react-native-community/netinfo";
import { useSelector } from "react-redux";
import { ColorSchemeName, Dimensions, Image, ScrollView, StyleSheet } from "react-native";
import { Coordinate } from "../interfaces/coordinate";
import { Event } from "../interfaces/event";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Region } from "../interfaces/region";
import { View } from "../components/Themed";

export default function EventDetailScreen({ navigation, route }: any) {
  const colorScheme: ColorSchemeName = useColorScheme();
  const eventId: number = route.params.eventId;
  const internetState: NetInfoState = useNetInfo();
  const mapRef: MutableRefObject<null> = useRef<null>(null);
  const selectedEvent: Event = useSelector<any, any>((state: any) =>
    state.events.savedEvents.find((event: Event) => event.id === eventId)
  );
  const initialRegionValue: Region = {
    latitude: selectedEvent.latitude,
    longitude: selectedEvent.longitude,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };
  let markerCoordinates: Coordinate = {
    latitude: selectedEvent.latitude ? selectedEvent.latitude : 0,
    longitude: selectedEvent.longitude ? selectedEvent.longitude : 0,
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

  if (internetState.isConnected === false) {
    return (
      <View style={styles.centered}>
        <StyledText style={styles.title}>
          Please turn on the Internet to use TamoTam.
        </StyledText>
      </View>
    );
  }

  const Map: () => JSX.Element = () => (
    <View style={styles.container}>
      <MapView
        customMapStyle={CustomMapStyles.CUSTOM_MAP_STYLES}
        followsUserLocation={true}
        initialRegion={initialRegionValue}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        showsUserLocation={true}
        style={styles.map}
      >
        {markerCoordinates && (
          <Marker
            coordinate={markerCoordinates}
            icon={selectedEvent.isUserEvent ? require("../assets/images/icon-map-user-event.png") : require("../assets/images/icon-map-tamotam-event.png")}
            tracksViewChanges={false}
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
          🗓️{" "}
          {
            new Date(selectedEvent.date) instanceof Date
              ? new Date(selectedEvent.date).toLocaleDateString()
              : "No information"
          }
        </StyledText>
        <StyledText style={styles.description}>
          🕒{" "}
          {
            new Date(selectedEvent.date) instanceof Date
              ? new Date(selectedEvent.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : "No information"
          }
        </StyledText>
        <Image
          source={
            selectedEvent.imageUrl && typeof selectedEvent.imageUrl === "string"
              ? { uri: selectedEvent.imageUrl }
              : require("../assets/images/no-image.jpeg")
          }
          style={styles.image}
        />
        {!selectedEvent.latitude || !selectedEvent.longitude ?
          <View style={styles.centered}>
            <StyledText style={styles.title}>
              Problem with obtaining coordinates.
            </StyledText>
          </View> :
          <Map />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
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
    fontWeight: "bold",
    textAlign: "center",
  },
});
