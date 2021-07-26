import React from "react";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
  defaultOnOverflowMenuPress,
  HeaderButtonProps,
} from "react-navigation-header-buttons";
import { Text, View } from "../components/Themed";

const MaterialHeaderButton = (
  props: JSX.IntrinsicAttributes &
    JSX.IntrinsicClassAttributes<HeaderButton> &
    Readonly<HeaderButtonProps> &
    Readonly<{ children?: React.ReactNode }>
) => {
  // the `props` here come from <Item ... />
  // you may access them and pass something else to `HeaderButton` if you like
  return (
    <HeaderButton
      IconComponent={MaterialIcons}
      iconSize={23}
      // you can customize the colors, by default colors from react navigation theme will be used
      // color="red"
      // pressColor="blue"
      {...props}
    />
  );
};

// normally, on android, text is UPPERCASED
const ReusableCapitalizedEditItem = ({ iconName, onPress }) => {
  return (
    <Item
      iconName={iconName}
      title="back"
      onPress={onPress}
      buttonStyle={{ textTransform: "capitalize" }}
    />
  );
};

export default function SavedEventsScreen({ navigation, route, navData }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <ReusableCapitalizedEditItem
            iconName={
              route.params && route.params.showIcon ? "arrow-back" : undefined
            }
            onPress={() => navigation.goBack()}
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
          {/* <Item
            title="Menu"
            iconName="ios-menu"
            onPress={() => {
              navData.navigation.toggleDrawer();
            }}
          /> */}
          <OverflowMenu
            OverflowIcon={
              <MaterialIcons name="more-vert" size={23} color="blue" />
            }
            pressColor="blue"
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
        <Text style={styles.title}>
          No saved events found. Start adding some!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Something is in</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
