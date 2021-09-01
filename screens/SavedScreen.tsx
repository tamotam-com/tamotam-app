import useColorScheme from "../hooks/useColorScheme";
import Card from "../components/Card";
import MaterialHeaderButton from "../components/MaterialHeaderButton";
import StyledText from "../components/StyledText";
import React from "react";
import { useSelector } from "react-redux";
import { Button, StyleSheet } from "react-native";
import {
  HeaderButtons,
  Item,
  HiddenItem,
  OverflowMenu,
  defaultOnOverflowMenuPress,
} from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "../components/Themed";

export default function SavedScreen({ navigation, route }) {
  const colorScheme = useColorScheme();

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
      // in your app, extract the arrow function into a separate component
      // to avoid creating a new one every time
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <Item
            color={colorScheme === "dark" ? "#ffbfbf" : "#b30000"}
            title="search"
            iconName="search"
            onPress={() => alert("search")}
          />
          <OverflowMenu
            OverflowIcon={
              <MaterialIcons
                color={colorScheme === "dark" ? "#ffbfbf" : "#b30000"}
                name="more-vert"
                size={23}
              />
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

  const savedEvents = useSelector((state) => state.events.savedEvents);

  if (savedEvents.length === 0 || !savedEvents) {
    return (
      <View style={styles.content}>
        <StyledText style={styles.title}>
          No saved events found. Start adding some!
        </StyledText>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <Card style={styles.product}>
        <StyledText style={styles.title}>{savedEvents[0].title}</StyledText>
        <Button
          title="Event Detail"
          onPress={() => navigation.navigate("EventDetail")}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  product: {
    height: 30,
    margin: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
