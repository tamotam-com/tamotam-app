import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const TabBarIcon = (props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) => {
  return <MaterialCommunityIcons size={34} style={{ margin: -6 }} {...props} />;
};

export default TabBarIcon;
