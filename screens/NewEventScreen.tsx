import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React, { useState } from "react";
import { ScrollView, Button, Text, TextInput, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import StyledText from "../components/StyledText";
import {
  HeaderButtons,
  Item,
  HiddenItem,
  OverflowMenu,
  defaultOnOverflowMenuPress,
} from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "../components/Themed";

export default function NewEventScreen({ navigation, route }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <Item
            iconName={
              route.params && route.params.showIcon ? "arrow-back" : undefined
            }
            onPress={() => navigation.goBack()}
            title="back"
          />
        </HeaderButtons>
      ),
      // in your app, extract the arrow function into a separate component
      // to avoid creating a new one every time
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <Item
            title="search"
            iconName="search"
            onPress={() => alert("search")}
          />
          <OverflowMenu
            OverflowIcon={
              <MaterialIcons name="more-vert" size={23} color="blue" />
            }
            onPress={(params) => {
              defaultOnOverflowMenuPress({
                ...params,
                cancelButtonLabel: "cancel - custom iOS label!",
              });
            }}
          >
            <HiddenItem
              icon={<MaterialIcons name="add" size={23} />}
              title="add"
              onPress={() => alert("add")}
            />
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [navigation]);

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
