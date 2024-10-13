import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DividerWithText {
  text?: string;
}

const DividerWithText = ({ text }: DividerWithText) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10, // Equivalent to `py-5`
  },
  line: {
    flex: 1, // Equivalent to `flex-grow`
    height: 1,
    backgroundColor: "gray", // Equivalent to `border-gray-400`
  },
  text: {
    marginHorizontal: 10, // Equivalent to `mx-4`
    color: "gray", // Equivalent to `text-gray-400`
  },
});

export default DividerWithText;
