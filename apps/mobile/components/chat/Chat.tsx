import React from "react";
import { ScrollView, View, RefreshControl, Pressable } from "react-native";
import { Text } from "../ui/text";
import { UserCard } from "./UserCard";
import { Separator } from "../ui/separator";
import { useContextUsers } from "~/hooks/useUsers";
import { UserBubble } from "./UserBubble";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { SearchInput } from "../shared/SearchInput";

const getRandomBoolean = () => Math.ceil(Math.random() * 3) === 1;

export const Chat = () => {
  const { users, isFetchingUsers, refetchUsers } = useContextUsers("messages");
  const navigation = useNavigation<NavigationProps>();

  React.useEffect(() => {
    refetchUsers();
  }, []);

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

      <View className="flex flex-col gap-2">
        <Text className="text-gray-800 dark:text-gray-200 text-sm">
          Recent Messages
        </Text>
        <Separator />
      </View>

      <View className="flex-1 pb-2">
        {/* Messages List */}

        <View className="flex-1 justify-between">
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
              <UserCard
                user={user}
                latestMessage="Latest Message"
                sentAt="12:55"
                isSeen={getRandomBoolean()}
                isPending={isFetchingUsers}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};
