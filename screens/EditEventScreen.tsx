import MaterialHeaderButton from "../components/MaterialHeaderButton";
import React, { useCallback, useReducer, useState } from "react";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import StyledText from "../components/StyledText";
import { updateEvent } from "../store/actions/events";
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
  const formReducer = (
    state: { inputValues: any },
    action: { type: string; input: any; value: any }
  ) => {
    if (action.type === FORM_INPUT_UPDATE) {
      const updatedValues: any = {
        ...state.inputValues,
        [action.input]: action.value,
      };
      return {
        inputValues: updatedValues,
      };
    }
    return state;
  };

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

  const [formState, dispatchFormState] = useReducer(formReducer, {
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

        await dispatch(
          updateEvent(
            event.id,
            event.coordinate,
            event.description,
            event.title
          )
        );
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

        await dispatch(
          updateEvent(
            event.id,
            event.coordinate,
            event.description,
            event.title
          )
        );
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
