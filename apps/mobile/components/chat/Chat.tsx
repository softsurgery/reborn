import React from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Text } from "../ui/text";
import { UserCard } from "./UserCard";
import { Separator } from "../ui/separator";
import { UserBubble } from "./UserBubble";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { SearchInput } from "../shared/SearchInput";
import { useFollowSystem } from "~/hooks/useFollowSystem";
import { useCurrentUser } from "~/hooks/useCurrentUser";

export const Chat = () => {
  const { currentUser } = useCurrentUser();
  const { followers, followings, isFollowersPending } = useFollowSystem({
    id: currentUser?.id!,
    use: ["followers", "followings"],
  });
  const navigation = useNavigation<NavigationProps>();

  return (
    <View className="flex-1 px-5">
      {/* Search Input */}
      <View className="flex flex-row justify-between items-center w-full pt-2">
        <View className="flex flex-row items-center w-full border-hidden rounded py-1">
          <SearchInput className="my-5" placeholder="Search for messages..." />
        </View>
      </View>

      <View className="flex flex-col gap-2">
        <Text className="text-gray-800 dark:text-gray-200 text-sm">
          List of active people
        </Text>
        <Separator />
      </View>

      {/* List of active people */}
      <View className="-mx-5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="my-4 px-4"
        >
          {followers.map((user) => (
            <UserBubble key={user.id} className="mx-1.5" user={user.follower} />
          ))}
        </ScrollView>
      </View>

      <View className="flex flex-col gap-2">
        <Text className="text-gray-800 dark:text-gray-200 text-sm">
          Recent Messages
        </Text>
        <Separator />
      </View>

      <View className="flex-1 pb-2">
        {/* Messages List */}

        <View className="flex-1 justify-between">
          {followers.map((user) => (
            <Pressable
              key={user.id}
              className="flex flex-col gap-2 py-2"
              onPress={() => navigation.navigate("chat/conversation", {})}
            >
              <UserCard
                user={user.follower}
                latestMessage="Latest Message"
                sentAt="12:55"
                isPending={isFollowersPending}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};
