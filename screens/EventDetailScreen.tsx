import useColorScheme from "../hooks/useColorScheme";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React from "react";
import StyledText from "../components/StyledText";
import { useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { ScrollView, StyleSheet, View } from "react-native";

export default function PlaceDetailScreen({ navigation, route }: any) {
  const colorScheme = useColorScheme();

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
