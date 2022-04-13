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
    <Card
      style={{
        backgroundColor:
          useColorScheme() === "dark"
            ? Colors.dark.background
            : Colors.light.background,
      }}
    >
      <Card.Title
        left={LeftContent}
        title={props.title}
        titleStyle={{
          color:
            useColorScheme() === "dark" ? Colors.dark.text : Colors.light.text,
        }}
      />
      <Card.Content>
        <Paragraph
          style={{
            color:
              useColorScheme() === "dark"
                ? Colors.dark.text
                : Colors.light.text,
          }}
        >
          {props.description}
        </Paragraph>
        <Paragraph
          style={{
            color:
              useColorScheme() === "dark"
                ? Colors.dark.text
                : Colors.light.text,
          }}
        >
          🗓️{" "}
          {isNaN(Number(props.date))
            ? "No information"
            : new Date(props.date).toLocaleDateString()}
        </Paragraph>
        <Paragraph
          style={{
            color:
              useColorScheme() === "dark"
                ? Colors.dark.text
                : Colors.light.text,
          }}
        >
          🕒{" "}
          {isNaN(Number(props.date))
            ? "No information"
            : new Date(props.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </Paragraph>
      </Card.Content>
      <Card.Cover
        source={
          typeof props.imageUrl === "string" && props.imageUrl !== ""
            ? { uri: props.imageUrl }
            : require("../assets/images/no-image.jpeg")
        }
      />
      <Card.Actions>
        <Button>{props.children}</Button>
      </Card.Actions>
    </Card>
  );
};

export default EventItem;
