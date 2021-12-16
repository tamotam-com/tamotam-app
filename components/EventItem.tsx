import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import React from "react";
import { Avatar, Button, Card, Paragraph } from "react-native-paper";

const LeftContent = (props: any) => (
  <Avatar.Icon
    {...props}
    color={useColorScheme() === "dark" ? Colors.dark.text : Colors.light.text}
    icon="map-check"
    style={{
      backgroundColor:
        useColorScheme() === "dark"
          ? Colors.dark.background
          : Colors.light.background,
    }}
  />
);

const EventItem = (props: any) => {
  return (
    <Card>
      <Card.Title title={props.title} left={LeftContent} />
      <Card.Content>
        <Paragraph>{props.description}</Paragraph>
      </Card.Content>
      <Card.Cover source={{ uri: props.imageUrl }} />
      <Card.Actions>
        <Button>{props.children}</Button>
      </Card.Actions>
    </Card>
  );
};

export default EventItem;
