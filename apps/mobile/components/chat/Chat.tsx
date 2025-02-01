import React from "react";
import { FlatList, Image, ScrollView, View } from "react-native";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { Search } from "lucide-react-native";
import { UserCard } from "./UserCard";
import { StableScrollView } from "../common/StableScrollView";
import { Separator } from "../ui/separator";

export const Chat = () => {
  const users = Array.from({ length: 50 }, (_, i) => i);
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
            className="flex-1 "
          />
        </View>
      </View>

      {/* List of active people */}
      <View>
        <Text className="text-gray-800 dark:text-gray-200 text-sm">
          List of active people
        </Text>
        {/* Avatar Row (Static) */}
        <View className="-mx-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="my-5"
          >
            {/* Static Users */}
            {users.map((user) => (
              <Image
                key={user}
                className="w-16 h-16 shadow-md rounded-full mx-1.5"
                source={require("~/assets/images/adaptive-icon.png")}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <Separator />

      {/* List of messages */}
      <View className="border-t border-gray-100 dark:border-gray-900 mx-1 gap-2" />
      {/* User Cards */}
      <StableScrollView>
        {/* Static Users */}
        <View className="flex flex-col gap-2 py-2">
          {users.map((user) => (
            <UserCard
              key={user}
              surname="John Doe"
              message="Hey, how are you?"
            />
          ))}
        </View>
      </StableScrollView>
    </View>
  );
};
