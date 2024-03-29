import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import EventItem from "../components/EventItem";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React, { useCallback, useEffect, useLayoutEffect, useState, Dispatch } from "react";
import StyledText from "../components/StyledText";
import { deleteEvent } from "../store/actions/events";
import { fetchUsersSavedEvents } from "../store/actions/events";
import { useDispatch, useSelector } from "react-redux";
import { useNetInfo, NetInfoState } from "@react-native-community/netinfo";
import { ActivityIndicator, Alert, ColorSchemeName, FlatList, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Event } from "../interfaces/event";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { View } from "../components/Themed";

export default function SavedScreen({ navigation, route }: any) {
  const colorScheme: ColorSchemeName = useColorScheme();
  const dispatch: Dispatch<any> = useDispatch<Dispatch<any>>();
  const internetState: NetInfoState = useNetInfo();
  const savedEvents: Event[] = useSelector(
    (state: any) => state.events.savedEvents
  );
  const [error, setError] = useState<Error>(new Error());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (error.message !== "") {
      Alert.alert(
        "Unknown Error ❌",
        "Please report this error by sending an email to us at feedback@tamotam.com. It will help us 🙏\nError details: " + error.message + "\nDate: " + new Date(),
        [{ text: "Okay" }]
      );
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> SavedScreen -> useEffect[error], error: " + error,
      });
      crashlytics().recordError(error);
    }
  }, [error]);

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

  const loadSavedEvents: () => Promise<void> = useCallback(async () => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> SavedScreen -> loadSavedEvents",
    });
    setError(new Error());
    setIsLoading(true);

    try {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> SavedScreen -> loadSavedEvents -> try",
      });
      dispatch(fetchUsersSavedEvents());
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert(
          "Error ❌",
          "We couldn't load saved events, sorry.\nTry to reload TamoTam!",
          [{ text: "Okay" }]
        );

        analytics().logEvent("custom_log", {
          description: "--- Analytics: screens -> SavedScreen -> loadSavedEvents -> catch, error: " + error,
        });
        crashlytics().recordError(error);
        setError(new Error(error.message));
      }
    } finally {
      analytics().logEvent("custom_log", {
        description: "--- Analytics: screens -> SavedScreen -> loadSavedEvents -> finally",
      });
      setIsLoading(false);
    }
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> SavedScreen -> useEffect[loadSavedEvents]",
    });
    loadSavedEvents();
  }, [loadSavedEvents]);

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

  if (internetState.isConnected === true && (savedEvents.length === 0 || !savedEvents)) {
    return (
      <View style={styles.centered}>
        <StyledText style={styles.title}>
          No saved events found. Start adding some!
        </StyledText>
      </View>
    );
  }

  if (internetState.isConnected === false) {
    return (
      <View style={styles.centered}>
        <StyledText style={styles.title}>
          Please turn on the Internet to use TamoTam.
        </StyledText>
      </View>
    );
  }

  const deleteHandler: (event: Event) => void = (event: Event) => {
    analytics().logEvent("custom_log", {
      description: "--- Analytics: screens -> SavedScreen -> deleteHandler",
    });
    Alert.alert("⚠️ Delete saved event ⚠️", "Do you want to perform this irreversible deletion?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          setError(new Error());
          setIsLoading(true);

          try {
            analytics().logEvent("custom_log", {
              description: "--- Analytics: screens -> SavedScreen -> deleteHandler -> try, event: " + event,
            });
            dispatch(deleteEvent(event));
          } catch (error: unknown) {
            if (error instanceof Error) {
              Alert.alert(
                "Error ❌",
                "TamoTam couldn't save this event.\nTry one more time!",
                [{ text: "Okay" }]
              );

              analytics().logEvent("custom_log", {
                description: "--- Analytics: screens -> SavedScreen -> deleteHandler -> catch, error: " + error,
              });
              crashlytics().recordError(error);
              setError(new Error(error.message));
            }
          } finally {
            analytics().logEvent("custom_log", {
              description: "--- Analytics: screens -> SavedScreen -> deleteHandler -> finally",
            });
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <FlatList
      data={savedEvents}
      keyExtractor={(item: Event, index: number) => index.toString()}
      renderItem={(eventData: Event | any) => (
        <EventItem
          date={eventData.item.date}
          description={eventData.item.description}
          imageUrl={
            eventData.item.imageUrl && typeof eventData.item.imageUrl === "string"
              ? eventData.item.imageUrl
              : require("../assets/images/no-image.jpeg")
          }
          time={eventData.item.time}
          title={eventData.item.title}
        >
          <Button
            buttonColor={
              colorScheme === "dark"
                ? Colors.dark.background
                : Colors.light.background
            }
            icon="information-outline"
            mode="text"
            onPress={() =>
              navigation.navigate("EventDetail", {
                eventId: eventData.item.id,
              })
            }
            textColor={
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
            }
          >
            Read More
          </Button>
          <Button
            buttonColor={
              colorScheme === "dark"
                ? Colors.dark.background
                : Colors.light.background
            }
            disabled={!eventData.item.isUserEvent}
            icon="lead-pencil"
            mode="text"
            onPress={() =>
              navigation.navigate("EditEvent", { eventId: eventData.item.id })
            }
            textColor={
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
            }
          >
            Edit
          </Button>
          <Button
            buttonColor={
              colorScheme === "dark"
                ? Colors.dark.background
                : Colors.light.background
            }
            icon="delete"
            mode="text"
            onPress={() => deleteHandler(eventData.item)}
            textColor={
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text
            }
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
