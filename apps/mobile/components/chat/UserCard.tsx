import { View } from "react-native";

import { Text } from "~/components/ui/text";

export const UserCard = ({
  surname = "No surname available",
  message = "No message available",
}: {
  surname?: string;
  message?: string;
}) => {
  return (
    <View className="flex flex-col gap-2 w-full py-2">
      {/* Name Row */}
      <View className="flex flex-row justify-between items-center">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {surname}
        </Text>
        {/* Optional phone number can go here */}
      </View>

      {/* Message Row */}
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        {message}
      </Text>
    </View>
  );
};
