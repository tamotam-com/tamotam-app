import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DrawerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drawer Screen</Text>
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
