import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import EventItem from "../components/EventItem";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import StyledText from "../components/StyledText";
import React, { useEffect, useState } from "react";
import { deleteEvent } from "../store/actions/events";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, Alert, FlatList, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Event } from "../interfaces/event";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { View } from "../components/Themed";

export default function SavedScreen({ navigation, route }: any) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const savedEvents: Event[] = useSelector(
    (state: any) => state.events.savedEvents
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const deleteHandler: (event: Event) => void = (event: Event) => {
    Alert.alert("Are you sure?", "Do you really want to delete this item?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          setError("");
          setIsLoading(true);

          try {
            dispatch(deleteEvent(event));
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
            }
          }

          setIsLoading(false);
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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          color={colorScheme === "dark" ? Colors.dark.text : Colors.light.text}
          size="large"
        />
      </View>
    );
  }

  return (
    <FlatList
      data={savedEvents}
      keyExtractor={(item: Event, index: number) => index.toString()}
      renderItem={(eventData: Event | any) => (
        <EventItem
          date={eventData.item.date}
          description={eventData.item.description}
          imageUrl={
            eventData.item.imageUrl === ""
              ? "https://picsum.photos/700"
              : eventData.item.imageUrl
          }
          time={eventData.item.time}
          title={eventData.item.title}
        >
          <Button
            color={
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
            }
            icon="information-outline"
            onPress={() =>
              navigation.navigate("EventDetail", {
                eventId: eventData.item.id,
              })
            }
          >
            Read More
          </Button>
          <Button
            color={
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
            }
            icon="lead-pencil"
            onPress={() =>
              navigation.navigate("EditEvent", { eventId: eventData.item.id })
            }
          >
            Edit
          </Button>

          <Button
            color={
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
            }
            icon="delete"
            onPress={() => deleteHandler(eventData.item)}
          >
            {" "}
          </Button>
        </EventItem>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
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
