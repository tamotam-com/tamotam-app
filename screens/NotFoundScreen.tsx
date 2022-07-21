import React, { useEffect } from "react";
import { isInternetConnectionAvailable } from "../common/isInternetConnectionAvailable";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../types";
import { StackScreenProps } from "@react-navigation/stack";

export default function NotFoundScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const isConnected: Promise<boolean | null> = isInternetConnectionAvailable();

  useEffect(() => {
    if (!isConnected._W) {
      Alert.alert(
        "No Internet! ❌",
        "Sorry, we need internet connection for TamoTam to run properly.",
        [{ text: "Okay" }]
      );
    }
  }, [isConnected]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <TouchableOpacity
        onPress={() => navigation.replace("Root")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    color: "#2e78b7",
    fontSize: 14,
  },
});
