import React from "react";
import StyledText from "../components/StyledText";
import { ScrollView, StyleSheet, View } from "react-native";

export default function PlaceDetailScreen() {
  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <View style={styles.eventDetailContainer}>
        <StyledText>Title: Sample Title</StyledText>
        <StyledText>Description: sample description...</StyledText>
        <StyledText>Adress: ABC (Map Preview)</StyledText>
        <StyledText>Adress: ABC</StyledText>
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
});
