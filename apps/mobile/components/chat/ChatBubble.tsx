import React from "react";
import { View, Text } from "react-native";

interface ChatBubbleProps {
  message: string;
  sender?: string;
  timestamp?: string;
  isOutgoing: boolean;
}

export default function ChatBubble({ message, sender, timestamp, isOutgoing }: ChatBubbleProps) {
  return (
    <View
      className={`max-w-[80%] px-3 py-2 my-1 rounded-2xl ${
        isOutgoing ? "bg-blue-500 self-end" : "bg-gray-700 self-start"
      }`}
    >
      {!isOutgoing && sender && <Text className="text-xs text-gray-700">{sender}</Text>}
      <Text className="text-white">{message}</Text>
      {timestamp && (
        <Text className="text-xs text-gray-300 text-right mt-1">{timestamp}</Text>
      )}
    </View>
  );
}
