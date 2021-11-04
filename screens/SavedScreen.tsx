import useColorScheme from "../hooks/useColorScheme";
import EventItem from "../components/EventItem";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import StyledText from "../components/StyledText";
import React from "react";
import { deleteEvent } from "../store/actions/events";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, FlatList, StyleSheet } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { View } from "../components/Themed";

export default function SavedScreen({ navigation, route }: any) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const savedEvents = useSelector((state: any) => state.events.savedEvents);

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
      // in your app, extract the arrow function into a separate component
      // to avoid creating a new one every time
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <Item
            color={colorScheme === "dark" ? "#ffbfbf" : "#b30000"}
            title="search"
            iconName="search"
            onPress={() => navigation.navigate("EditEvent")}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const deleteHandler = (eventId: number) => {
    Alert.alert("Are you sure?", "Do you really want to delete this item?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(deleteEvent(eventId));
        },
      },
    ]);
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
    <FlatList
      data={savedEvents}
      keyExtractor={(item) => item.id}
      renderItem={(eventData: Event | any) => (
        <EventItem
          description={eventData.item.description}
          title={eventData.item.title}
        >
          <Button
            title="Event Detail"
            onPress={() =>
              navigation.navigate("EventDetail", { eventId: eventData.item.id })
            }
          />
          <Button
            title="Edit Event"
            onPress={() =>
              navigation.navigate("EditEvent", { eventId: eventData.item.id })
            }
          />
          <Button title="x" onPress={() => deleteHandler(eventData.item.id)} />
        </EventItem>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
