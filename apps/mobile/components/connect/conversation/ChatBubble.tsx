import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { cn } from "~/lib/utils";

interface ChatBubbleProps {
  message?: string;
  currentUserUid?: string;
  senderUid?: string;
  timestamp?: string;
  isOutgoing?: boolean;
}

export const ChatBubble = ({
  message,
  currentUserUid,
  senderUid,
  timestamp,
  isOutgoing,
}: ChatBubbleProps) => {
  console.log(message, " ", timestamp);
  return (
    <TouchableWithoutFeedback>
      <View className="mt-2 ">
        <View
          className={cn(
            "bg-purple-600 max-w-[80%] mx-2 p-2 rounded-lg ",
            senderUid === currentUserUid
              ? "self-end rounded-bl-xl rounded-br-none"
              : "self-start rounded-br-xl rounded-bl-none"
          )}
        >
          <Text className="text-white font-semibold pb-0.5">{message}</Text>
          <Text className="text-xs text-white text-right">{timestamp}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
