import React from "react";
import {
  HeaderButton,
  HeaderButtonProps,
} from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";

const MaterialHeaderButton = (
  props: JSX.IntrinsicAttributes &
    JSX.IntrinsicClassAttributes<HeaderButton> &
    Readonly<HeaderButtonProps> &
    Readonly<{ children?: React.ReactNode }>
) => {
  return (
    <HeaderButton IconComponent={MaterialIcons} iconSize={23} {...props} />
  );
};

export default MaterialHeaderButton;
