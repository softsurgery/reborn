import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from "react-native";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { Search } from "lucide-react-native";
import { MessageCard } from "./MessageCard";
import { Separator } from "../ui/separator";
import { useContextUsers } from "~/hooks/useUsers";
import { UserBubble } from "./UserBubble";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";

const getRandomBoolean = () => Math.ceil(Math.random() * 3) === 1;

export const Chat = () => {
  const { users, isFetchingUsers, refetchUsers } = useContextUsers("messages");
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    refetchUsers();
  }, []);

  return (
    <View className="flex-1 px-5 mb-2">
      <Text className="text-4xl font-bold pb-1">Chat</Text>
      <View className="border-t border-gray-100 dark:border-gray-900 mx-1 gap-2" />

      {/* Search Input */}
      <View className="flex flex-row justify-between items-center w-full pt-2">
        <View className="flex flex-row items-center w-full border-hidden rounded py-1">
          <IconWithTheme icon={Search} size={24} />
          <Input
            placeholder="Search message..."
            placeholderTextColor="#9ca3af"
            className="flex-1"
          />
        </View>
      </View>

      {/* List of active people */}
      <View>
        <Text className="text-gray-800 dark:text-gray-200 text-sm">
          List of active people
        </Text>
        <View className="-mx-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="my-5 px-4"
          >
            {users.map((user) => (
              <UserBubble
                key={user.uid}
                className="mx-1.5"
                label={user.surname}
                uid={user.uid}
                gender={user.isMale}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <Separator />

      {/* Messages List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingUsers}
            onRefresh={refetchUsers}
          />
        }
      >
        <Text className="text-gray-800 dark:text-gray-200 text-sm">
          Recent Messages
        </Text>

        {users.map((user) => (
          <Pressable
            key={user.uid}
            className="flex flex-col gap-2 py-2"
            onPress={() =>
              navigation.navigate("chat/conversation", {
                user,
              })
            }
          >
            <MessageCard
              user={user}
              latestMessage="Latest Message"
              sentAt="12:55"
              isSeen={getRandomBoolean()}
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
