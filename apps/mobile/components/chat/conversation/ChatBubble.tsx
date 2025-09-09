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
    <StablePressable>
      <View className="mt-2">
        <View
          className={cn(
            "max-w-[80%] mx-2 p-2 rounded-lg",
            right
              ? "self-end rounded-bl-xl rounded-br-none bg-muted"
              : "self-start rounded-br-xl rounded-bl-none bg-secondary"
          )}
        >
          <Text className="font-semibold pb-0.5">{message}</Text>
          <Text className="text-xs text-right">
            {format(timestamp, "hh:mm a")}
          </Text>
        </View>
      </View>
    </StablePressable>
  );
};
