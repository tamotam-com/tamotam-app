import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React from "react";
import StyledText from "../components/StyledText";
import { useSelector } from "react-redux";
import {
  HeaderButtons,
  Item,
  HiddenItem,
  OverflowMenu,
  defaultOnOverflowMenuPress,
} from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";

export default function PlaceDetailScreen({ navigation, route }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <Item
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
            title="search"
            iconName="search"
            onPress={() => alert("search")}
          />
          <OverflowMenu
            OverflowIcon={
              <MaterialIcons name="more-vert" size={23} color="blue" />
            }
            onPress={(params) => {
              defaultOnOverflowMenuPress({
                ...params,
                cancelButtonLabel: "cancel - custom iOS label!",
              });
            }}
          >
            <HiddenItem
              icon={<MaterialIcons name="add" size={23} />}
              title="add"
              onPress={() => alert("add")}
            />
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const savedEvents = useSelector((state) => state.events.savedEvents);

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
      <View style={styles.eventDetailContainer}>
        <StyledText>Title: {savedEvents[0].title}</StyledText>
        <StyledText>Description: {savedEvents[0].description}</StyledText>
        <StyledText>
          Adress: {savedEvents[0].coordinate.latitude},{" "}
          {savedEvents[0].coordinate.longitude}
        </StyledText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eventDetailContainer: {
    backgroundColor: "red",
    borderRadius: 10,
    marginVertical: 20,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
