import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { UserBubble } from "./UserBubble";
import { cn } from "~/lib/utils";
import Icon from "~/lib/Icon";
import { MessageCircleMoreIcon } from "lucide-react-native";
import { ResponseClientDto } from "~/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api";
import { identifyUserAvatar } from "~/lib/user.utils";
import React from "react";

interface UserCardProps {
  className?: string;
  user: ResponseClientDto;
  latestMessage?: string;
  sentAt?: string;
  isSeen?: boolean;
  isPending?: boolean;
}

export const UserCard = ({
  className,
  user,
  latestMessage,
  sentAt,
  isSeen,
  isPending,
}: UserCardProps) => {
  return (
    <View
      className={cn(
        "flex flex-row justify-between items-center gap-2 w-full",
        className
      )}
    >
      <View className="flex flex-row gap-2 items-center">
        <UserBubble className="w-20 h-20" user={user} />
        <View className="flex flex-col justify-between items-start">
          <Text className="text-lg font-semibold">{`${user?.username} ${user?.username}`}</Text>
          <View className="flex flex-row gap-2 items-center">
            <Text className="text-xs font-semibold">{latestMessage}</Text>
            <Text className="text-xs font-thin">{sentAt}</Text>
          </View>
        </View>
      </View>

      {/* Message Row */}
      {isSeen && (
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          <Icon name={MessageCircleMoreIcon} />
        </Text>
      )}
    </View>
  );
};
