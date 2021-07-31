import React from "react";
import { Ionicons } from "@expo/vector-icons";

const TabBarIcon = (props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) => {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
};

export default TabBarIcon;
