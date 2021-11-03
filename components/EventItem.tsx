import useColorScheme from "../hooks/useColorScheme";
import React from "react";
import { Avatar, Button, Card, Paragraph } from "react-native-paper";

const LeftContent = (props: any) => (
  <Avatar.Icon
    {...props}
    // TODO: Fix problem with not being possible to use the React Hook twice and just uncomment it.
    // color={useColorScheme() === "dark" ? "#ffbfbf" : "#b30000"}
    icon="map-check"
    style={{
      backgroundColor: useColorScheme() === "dark" ? "#ffffff" : "#000000",
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
      <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
      <Card.Actions>
        <Button>{props.children}</Button>
      </Card.Actions>
    </Card>
  );
};

export default EventItem;
