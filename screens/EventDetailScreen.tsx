import useColorScheme from "../hooks/useColorScheme";
import MapPreview from "../components/MapPreview";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React from "react";
import StyledText from "../components/StyledText";
import { useSelector } from "react-redux";
import { Event } from "../interfaces/event";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { ScrollView, StyleSheet, View } from "react-native";

export default function PlaceDetailScreen({ navigation, route }: any) {
  const colorScheme = useColorScheme();
  const eventId: number = route.params.eventId;
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
  const selectedLocation = { latitude: 50.0, longitude: 50.0 };
  const showMapHandler = () => {
    navigation.navigate("Map");
  };

  if (savedEvents.length === 0 || !savedEvents) {
    return (
      <View style={styles.content}>
        <StyledText style={styles.title}>
          No saved events found. Start adding some!
        </StyledText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <View style={styles.container}>
        <StyledText>Title: {selectedEvent.title}</StyledText>
        <StyledText>Description: {selectedEvent.description}</StyledText>
        <StyledText>
          Adress: {selectedEvent.coordinate.latitude},{" "}
          {selectedEvent.coordinate.longitude}
        </StyledText>
      </View>
      <MapPreview
        style={styles.mapPreview}
        location={selectedLocation}
        onPress={showMapHandler}
      />
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
  mapPreview: {
    width: "100%",
    maxWidth: 350,
    height: 300,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
