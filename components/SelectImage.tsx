import * as ImagePicker from "expo-image-picker";
import useColorScheme from "../hooks/useColorScheme";
import React, { useEffect, useState } from "react";
import { Alert, Image, Platform, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Text, View } from "./Themed";

const SelectImage = (props: { onImageTaken: (arg0: string) => void }) => {
  const colorScheme = useColorScheme();
  const [pickedImage, setPickedImage] = useState("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Insufficient permissions!",
            "Sorry, we need camera roll permissions to make this work!",
            [{ text: "Okay" }]
          );
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
  };

  return (
    <View style={styles.selectImage}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>No image picked yet.</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage }} />
        )}
      </View>
      <Button
        color={colorScheme === "dark" ? "#ffbfbf" : "#b30000"}
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
    width: "100%",
    height: 200,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default SelectImage;