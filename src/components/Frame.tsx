import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const FrameStyles = StyleSheet.create({
  frame: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fafafa",
  },
  content: {
    height: "auto",
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: "#fafafa",
  },
  menu: {
    flexDirection: "row",
    justifyContent: "center",
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: "#f8f8f8",
  },
  menuButton: {
    borderColor: "#ebebeb",
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
  },
  menuText: {
    fontSize: 6,
    textAlign: "center",
  },
  menuButtonIcon: { fill: "black", stroke: "black", height: 18, width: 18 },
});

export const Frame = (props: {
  children: React.ReactNode;
  menu?: React.ReactNode;
}) => (
  <View style={FrameStyles.frame}>
    <View style={FrameStyles.content}>{props.children}</View>
    {props.menu && <View style={FrameStyles.menu}>{props.menu}</View>}
  </View>
);

export const MenuButton = (props: {
  onPress: () => unknown;
  children: React.ReactNode;
}) => (
  <Pressable style={FrameStyles.menuButton} onPress={props.onPress}>
    {props.children}
  </Pressable>
);

export const MenuText = (props: { children: React.ReactNode }) => (
  <Text style={FrameStyles.menuText}>{props.children}</Text>
);
