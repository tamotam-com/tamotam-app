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
          {
            new Date(props.date) instanceof Date
              ? new Date(props.date).toLocaleDateString()
              : "No information"
          }
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
          {
            new Date(props.date) instanceof Date
              ? new Date(props.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : "No information"
          }
        </Paragraph>
      </Card.Content>
      <Card.Cover
        source={
          props.imageUrl && typeof props.imageUrl === "string"
            ? { uri: props.imageUrl }
            : require("../assets/images/no-image.jpeg")
        }
      />
      <Card.Actions>
        {props.children}
      </Card.Actions>
    </Card>
  );
};

export default EventItem;
