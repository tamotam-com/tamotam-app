import Card from "../components/Card";
import StyledText from "../components/StyledText";
import React from "react";
import { useSelector } from "react-redux";
import { Button, StyleSheet } from "react-native";
import { View } from "../components/Themed";

export default function SavedScreen({ navigation }) {
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
    <View style={styles.content}>
      <Card style={styles.product}>
        <StyledText style={styles.title}>
          {savedEvents[0].title}, {savedEvents[0].description},{" "}
          {savedEvents[0].coordinate.latitude},{" "}
          {savedEvents[0].coordinate.longitude}
        </StyledText>
        <Button
          title="Event Detail"
          onPress={() => navigation.navigate("EventDetail")}
        />
      </Card>
    </View>
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
  product: {
    height: 30,
    margin: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
