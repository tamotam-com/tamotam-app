import React from "react";
import { Text, TextProps } from "./Themed";

const StyledText = (props: TextProps) => {
  return (
    <Text {...props} style={[props.style, { fontFamily: "space-mono" }]} />
  );
};

export default StyledText;
