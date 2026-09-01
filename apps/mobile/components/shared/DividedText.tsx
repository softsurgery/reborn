import React from "react";
import { Text, View } from "react-native";

interface DividedTextProps {
  text?: string;
}

const DividedText = ({ text }: DividedTextProps) => {
  return (
    <View className="flex-row items-center py-2.5">
      <View className="flex-1 h-[1px] bg-muted-foreground" />
      <Text className="mx-2.5 text-muted-foreground">{text}</Text>
      <View className="flex-1 h-[1px] bg-muted-foreground" />
    </View>
  );
};

export default DividedText;
