import React from "react";
import { Image, ScrollView, View } from "react-native";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { Search } from "lucide-react-native";
import { UserCard } from "./UserCard";
import { StableScrollView } from "../common/StableScrollView";
import { Separator } from "../ui/separator";
import { useContextUsers } from "~/hooks/useUsers";
import { UserBubble } from "./UserBubble";
import { Button } from "../ui/button";

export const Chat = () => {
  const { users, isFetchingUsers, refetchUsers } = useContextUsers("messages");

  React.useEffect(() => {
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
            className="my-5 px-4"
          >
            {/* Static Users */}
            {users.map((user) => (
              <UserBubble
                label={user.surname}
                uid={user.surname}
                gender={user.isMale}
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
              key={user.uid}
              surname={`${user.name} ${user.surname}`}
              message="Hey, how are you?"
            />
          ))}
        </View>
      </StableScrollView>
      <Button  onPress={() => refetchUsers()}><Text className="dark:text-black text-white">refetchUsers {isFetchingUsers ? "Yes" : "No"}</Text></Button>
    </View>
  );
};
