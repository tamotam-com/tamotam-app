import React, { useState } from "react";
import {
  ScrollView,
  View,
  Button,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import Colors from "../constants/Colors";
import StyledText from "../components/StyledText";

export default function NewEventScreen(props: {
  navigation: { goBack: () => void };
}) {
  const [titleValue, setTitleValue] = useState("");

  const titleChangeHandler = (text: React.SetStateAction<string>) => {
    // you could add validation
    setTitleValue(text);
  };

  const savePlaceHandler = () => {
    props.navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <StyledText style={styles.label}>Title</StyledText>
        <TextInput
          style={styles.textInput}
          onChangeText={titleChangeHandler}
          value={titleValue}
        />
        <Button title="Save Place" onPress={savePlaceHandler} />
      </View>
    </ScrollView>
  );
}

NewEventScreen.navigationOptions = {
  headerTitle: "Add Place",
};

const styles = StyleSheet.create({
  form: {
    margin: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 15,
  },
  textInput: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
});
