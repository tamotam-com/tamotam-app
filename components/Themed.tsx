import * as React from "react";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import { Text as DefaultText, View as DefaultView } from "react-native";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps: string | undefined = props[theme];

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

export function Text(props: TextProps) {
  const { darkColor, lightColor, style, ...otherProps } = props;
  const color = useThemeColor({ dark: darkColor, light: lightColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { darkColor, lightColor, style, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { dark: darkColor, light: lightColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
