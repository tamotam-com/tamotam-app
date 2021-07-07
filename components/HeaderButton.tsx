import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import PropTypes, { InferProps } from "prop-types";

const CustomHeaderButton: any = (
  props: InferProps<typeof CustomHeaderButton.propTypes>
) => {
  return (
    <HeaderButton
      {...props}
      iconSize={23}
      IconComponent={Ionicons}
      title="test"
    />
  );
};

CustomHeaderButton.propTypes = {
  title: PropTypes.string.isRequired,
};

export default CustomHeaderButton;
