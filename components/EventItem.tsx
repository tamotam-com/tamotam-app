import Card from "../components/Card";
import React from "react";
import StyledText from "../components/StyledText";
import { StyleSheet } from "react-native";
import { View } from "../components/Themed";

const EventItem = (props: any) => {
  return (
    <Card style={styles.product}>
      <StyledText style={styles.title}>{props.title}</StyledText>
      <View style={styles.actions}>{props.children}</View>
    </Card>
  );
};

const styles = StyleSheet.create({
  actions: {
    alignItems: "center",
    flexDirection: "row",
    height: "23%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  product: {
    height: 300,
    margin: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default EventItem;
