import * as ImagePicker from "expo-image-picker";
import analytics from "@react-native-firebase/analytics";
import storage, { FirebaseStorageTypes } from "@react-native-firebase/storage";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import React, { useEffect, useState } from "react";
import { ColorSchemeName, Image, Platform, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Text, View } from "./Themed";

const SelectImage = (props: {
  existingImageUrl?: string;
  imageUrlStorageFromChild: (arg0: string) => void;
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
      }
    })();
  }, []);

  const selectImageHandler = async () => {
    let bucketStorageReference: FirebaseStorageTypes.Reference | string = "";
    let image: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        // TODO: Shall it be also camera?
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

    if (!image.canceled) {
      setPickedImage(image.assets[0].uri);

      bucketStorageReference = await storage().ref(new Date().getTime().toString()); // Randomize the file name of an image in order not to forward local path of a user image.

      const pathToFile: string = image.assets[0].uri;
      const bucketStorageTaskSnapshot: FirebaseStorageTypes.TaskSnapshot | any = await bucketStorageReference.putFile(pathToFile);

      props.imageUrlStorageFromChild(bucketStorageTaskSnapshot.metadata.fullPath);
    }
    analytics().logEvent("custom_log", {
      description: "--- Analytics: components -> SelectImage -> selectImageHandler, image: " + image,
    });
  };

  return (
    <View style={styles.selectImage}>
      <View style={styles.imagePreview}>
        {!pickedImage &&
          (!props.existingImageUrl || typeof props.existingImageUrl !== "string") ? (
          <Text>No image picked yet.</Text>
        ) : (
          <Image
            style={styles.image}
            source={{
              uri: pickedImage
                ? pickedImage
                : props.existingImageUrl
            }}
          />
        )}
      </View>
      <Button
        buttonColor={
          colorScheme === "dark"
            ? Colors.dark.background
            : Colors.light.background
        }
        icon="camera"
        onPress={selectImageHandler}
        textColor={
          colorScheme === "dark" ? Colors.dark.text : Colors.light.text
        }
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
