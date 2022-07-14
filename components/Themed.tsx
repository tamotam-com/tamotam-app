import analytics from "@react-native-firebase/analytics";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import React from "react";
import { Text as DefaultText, View as DefaultView } from "react-native";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme: "light" | "dark" = useColorScheme();
  const colorFromProps: string | undefined = props[theme];

  analytics().logEvent("custom_log", {
    description: "--- Analytics: components -> Themed -> useThemeColor, theme: " + theme,
  });
  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  darkColor?: string;
  lightColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

// TODO: For now it's not being used, check out how text could be changed not manually, but instead using this function.
export function Text(props: TextProps) {
  const { darkColor, lightColor, style, ...otherProps } = props;
  const color: string = useThemeColor({ dark: darkColor, light: lightColor }, "text");

  analytics().logEvent("custom_log", {
    description: "--- Analytics: components -> Themed -> Text, color: " + color,
  });
  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { darkColor, lightColor, style, ...otherProps } = props;
  const backgroundColor: string = useThemeColor(
    { dark: darkColor, light: lightColor },
    "background"
  );

  analytics().logEvent("custom_log", {
    description: "--- Analytics: components -> Themed -> View, backgroundColor: " + backgroundColor,
  });
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
