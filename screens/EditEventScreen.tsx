import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React, { useCallback, useState } from "react";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import StyledText from "../components/StyledText";
import { addEvent } from "../store/actions/events";
import { useDispatch, useSelector } from "react-redux";
import { Button, ScrollView, StyleSheet, TextInput } from "react-native";
import { Event } from "../interfaces/event";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { View } from "../components/Themed";

export default function EditEventScreen({ navigation, route }: any) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const editedEvent = useSelector((state) =>
    state.events.savedEvents.find((event: Event) => event.id === 2)
  );
  const [error, setError] = useState();
  const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <Item
            color={colorScheme === "dark" ? "#ffbfbf" : "#b30000"}
            iconName={
              route.params && route.params.showIcon ? "arrow-back" : undefined
            }
            onPress={() => navigation.goBack()}
            title="back"
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const [formState, dispatchFormState] = useState({
    inputValues: {
      description: editedEvent ? editedEvent.description : "",
      title: editedEvent ? editedEvent.title : "",
    },
  });

  const submitHandler = useCallback(async () => {
    setError(null);
    try {
      if (editedEvent) {
        const event: Event = {
          id: 2,
          coordinate: {
            latitude: 51.0,
            longitude: 5.0,
          },
          description: formState.inputValues.description,
          title: formState.inputValues.title,
        };

        await dispatch(addEvent(event));
      } else {
        const event: Event = {
          id: 2,
          coordinate: {
            latitude: 51.0,
            longitude: 5.0,
          },
          description: formState.inputValues.description,
          title: formState.inputValues.title,
        };

        await dispatch(addEvent(event));
      }
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, 2, formState]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <ScrollView>
      <View style={styles.form}>
        <StyledText style={styles.label}>Title</StyledText>
        <TextInput
          style={styles.textInput}
          onChangeText={inputChangeHandler}
          value={editedEvent ? editedEvent.title : ""}
        />
        <StyledText style={styles.label}>Description</StyledText>
        <TextInput
          style={styles.textInput}
          onChangeText={inputChangeHandler}
          value={editedEvent ? editedEvent.description : ""}
        />
        <Button title="Save" onPress={submitHandler} />
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
