import { format } from "date-fns";
import React from "react";
import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface ChatBubbleProps {
  message?: string;
  timestamp: Date;
  right?: boolean;
  isPending?: boolean;
}

export const ChatBubble = ({
  message,
  timestamp,
  right,
  isPending,
}: ChatBubbleProps) => {
  return (
    <View
      className={cn(
        "max-w-[80%] mx-2 rounded-lg mt-2",
        right
          ? "self-end rounded-bl-xl rounded-br-none bg-muted"
          : "self-start rounded-br-xl rounded-bl-none bg-secondary"
      )}
    >
      <StablePressable
        className={cn("p-2")}
        onPressClassname="bg-muted/50 "
        onPress={() => {
          console.log("Pressed");
        }}
      >
        <Text className="font-semibold pb-0.5">{message}</Text>
        <Text className="text-xs text-right">
          {format(timestamp, "hh:mm a")}
        </Text>
      </StablePressable>
    </View>
  );
};
