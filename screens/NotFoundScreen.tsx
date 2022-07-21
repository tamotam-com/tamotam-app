import React, { useEffect } from "react";
import StyledText from "../components/StyledText";
import { isInternetConnectionAvailable } from "../common/isInternetConnectionAvailable";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../types";
import { StackScreenProps } from "@react-navigation/stack";

export default function NotFoundScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "NotFound">) {
  const isConnected: boolean | null = isInternetConnectionAvailable();

  useEffect(() => {
    if (!isConnected === false) {
      Alert.alert(
        "No Internet! ❌",
        "Sorry, we need an Internet connection for TamoTam to run correctly.",
        [{ text: "Okay" }]
      );
    }
  }, [isConnected]);

  if (isConnected === false) {
    return (
      <View style={styles.centered}>
        <StyledText style={styles.title}>
          Please turn on the Internet to use TamoTam.
        </StyledText>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
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
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    color: "#2e78b7",
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
