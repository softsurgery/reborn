import React from "react";
import { Image, ScrollView, View } from "react-native";
import { Text } from "../ui/text";
import { Input } from "../ui/input";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { Search } from "lucide-react-native";
import { UserCard } from "./UserCard";
import { StableScrollView } from "../common/StableScrollView";

export const Chat = () => {
  return (
    <View className="px-4 pb-2 ">
      <Text className="text-4xl font-bold pb-1">Chat</Text>
      <View className="border-t border-gray-100 dark:border-gray-900 mx-1 gap-2" />
      {/* Search Input */}
      <View className="flex flex-row justify-between items-center w-full pt-2">
        <View className="flex flex-row items-center w-full border rounded py-1">
          <IconWithTheme icon={Search} size={24} />
          <Input
            placeholder="Search message..."
            placeholderTextColor="#9ca3af"
            className="flex-1 text-gray-800 dark:text-gray-200"
          />
        </View>
      </View>

      {/* List of available people */}
      <Text className="text-gray-800 dark:text-gray-200 text-sm">
        List of active people
      </Text>

      {/* Avatar Row (Static) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* Static Users */}
        <View className="flex flex-row gap-2 py-2">
          <Image
            className="w-16 h-16 shadow-md rounded-full"
            source={require("~/assets/images/adaptive-icon.png")}
          />
          <Image
            className="w-16 h-16 shadow-md rounded-full"
            source={require("~/assets/images/adaptive-icon.png")}
          />
          <Image
            className="w-16 h-16  shadow-md rounded-full"
            source={require("~/assets/images/adaptive-icon.png")}
          />
          <Image
            className="w-16 h-16 shadow-md rounded-full"
            source={require("~/assets/images/adaptive-icon.png")}
          />
          <Image
            className="w-16 h-16 shadow-md rounded-full"
            source={require("~/assets/images/adaptive-icon.png")}
          />
          <Image
            className="w-16 h-16 shadow-md rounded-full"
            source={require("~/assets/images/adaptive-icon.png")}
          />
          <Image
            className="w-16 h-16 shadow-md rounded-full"
            source={require("~/assets/images/adaptive-icon.png")}
          />
          <Image
            className="w-16 h-16 shadow-md rounded-full"
            source={require("~/assets/images/adaptive-icon.png")}
          />
          <Image
            className="w-16 h-16 shadow-md rounded-full"
            source={require("~/assets/images/adaptive-icon.png")}
          />
        </View>
      </ScrollView>
      <View className="border-t border-gray-100 dark:border-gray-900 mx-1 gap-2" />
      {/* User Cards */}
      <View className="flex flex-col px-4">
        <ScrollView className="flex flex-col">
          <UserCard surname="John Doe" message="Hey, how are you?" />
          <UserCard surname="Jane Smith" message="See you tomorrow!" />
          <UserCard surname="Alice Johnson" message="Let's catch up soon." />
          <UserCard surname="Michael Brown" message="Looking forward to it!" />
          <UserCard
            surname="Emily Davis"
            message="Can we reschedule our meeting?"
          />
          <UserCard
            surname="Daniel Garcia"
            message="I'll send the documents by noon."
          />
          <UserCard surname="Sophia Wilson" message="Happy Birthday, John!" />
          <UserCard
            surname="David Miller"
            message="Don't forget our call at 3 PM."
          />
          <UserCard surname="Emma Thompson" message="What time is the event?" />
          <UserCard
            surname="James Moore"
            message="I just sent the files over email."
          />
          <UserCard
            surname="Olivia Taylor"
            message="Thanks for your help today!"
          />
          <UserCard
            surname="William Anderson"
            message="Do you need anything else?"
          />
          <UserCard
            surname="Charlotte Lee"
            message="Let me know when you're free."
          />
          <UserCard
            surname="Benjamin Hall"
            message="I enjoyed our last discussion."
          />
          <UserCard
            surname="Amelia Harris"
            message="I'll meet you at the cafe."
          />
          <UserCard surname="Lucas Clark" message="Thanks for the update!" />
          <UserCard
            surname="Mia Lewis"
            message="Let's finalize the details tomorrow."
          />
          <UserCard
            surname="Ethan Martinez"
            message="I’ll see you at the gym later."
          />
          <UserCard
            surname="Isabella Perez"
            message="Your presentation was amazing!"
          />
          <UserCard
            surname="Alexander Young"
            message="Could you review the report?"
          />
        </ScrollView>
      </View>
    </View>
  );
};
