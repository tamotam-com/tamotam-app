import * as Linking from "expo-linking";

export default {
  config: {
    screens: {
      Map: {
        screens: {
          MapScreen: "map",
        },
      },
      Saved: {
        screens: {
          SavedScreen: "saved",
        },
      },
    },
  },
  NotFound: "*",
  prefixes: [Linking.makeUrl("/")],
};
