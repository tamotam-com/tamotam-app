import StyledText from "./../components/StyledText";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function DrawerScreen() {
  return (
    <View style={styles.container}>
      <StyledText style={styles.title}>Drawer Screen</StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
