import * as ImagePicker from "expo-image-picker";
import analytics from "@react-native-firebase/analytics";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import React, { useEffect, useState } from "react";
import { Alert, ColorSchemeName, Image, Platform, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Text, View } from "./Themed";

const SelectImage = (props: {
  existingImageUrl?: string;
  onImageTaken: (arg0: string) => void;
}) => {
  const colorScheme: ColorSchemeName = useColorScheme();
  const [pickedImage, setPickedImage] = useState("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        analytics().logEvent("custom_log", {
          description: "--- Analytics: components -> SelectImage -> useEffect[], status: " + status,
        });
        analytics().logEvent("custom_log", {
          description: "--- Analytics: components -> SelectImage -> useEffect[], Platform.OS: " + Platform.OS,
        });
        if (status !== "granted") {
          Alert.alert(
            "⚠️ Insufficient permissions! ⚠️",
            "Sorry, we need camera roll permissions to make this work!",
            [{ text: "Okay" }]
          );
          return;
        }
      }
    })();
  }, []);

  const selectImageHandler = async () => {
    let image: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        // TODO: Shall it be also camera?
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

    if (!image.cancelled) {
      setPickedImage(image.uri);
      props.onImageTaken(image.uri);
    }
    analytics().logEvent("custom_log", {
      description: "--- Analytics: components -> SelectImage -> selectImageHandler, image: " + image,
    });
  };

  return (
    <View style={styles.selectImage}>
      <View style={styles.imagePreview}>
        {!pickedImage &&
          (!props.existingImageUrl || props.existingImageUrl === "") ? (
          <Text>No image picked yet.</Text>
        ) : (
          <Image
            style={styles.image}
            source={pickedImage ? pickedImage : props.existingImageUrl
              ? { uri: props.existingImageUrl }
              : require("../assets/images/no-image.jpeg")}
          />
        )}
      </View>
      <Button
        color={colorScheme === "dark" ? Colors.dark.text : Colors.light.text}
        icon="camera"
        onPress={selectImageHandler}
      >
        Upload Image
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  selectImage: {
    alignItems: "center",
    marginBottom: 15,
    marginTop: 15,
  },
  imagePreview: {
    alignItems: "center",
    borderColor: "#ccc",
    borderRadius: 10,
    borderWidth: 1,
    height: 200,
    justifyContent: "center",
    marginBottom: 10,
    width: "100%",
  },
  image: {
    borderRadius: 10,
    height: "100%",
    width: "100%",
  },
});

export default SelectImage;
