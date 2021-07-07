import HeaderButton from "../components/HeaderButton";
import React from "react";
// import { useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

const SavedEventsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        No favorite meals found. Start adding some!
      </Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
    </View>
  );
};

SavedEventsScreen.navigationOptions = (navData: any) => {
  return {
    headerTitle: "Saved Events",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default SavedEventsScreen;
