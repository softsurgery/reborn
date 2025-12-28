import React from "react";
import { router } from "expo-router";
import { EllipsisIcon } from "lucide-react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Icon } from "~/components/ui/icon";
import { cn } from "~/lib/utils";

interface ChatHeaderRightProps {
  className?: string;
  id: string;
}

export const ChatHeaderRight = ({ className, id }: ChatHeaderRightProps) => {
  return (
    <StablePressable
      className={cn("mx-2", className)}
      onPress={() =>
        router.push({
          pathname: "/main/chat/conversation-details",
          params: { id },
        })
      }
    >
      <Icon as={EllipsisIcon} size={28} />
    </StablePressable>
  );
};
