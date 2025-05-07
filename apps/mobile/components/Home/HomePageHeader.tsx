import { SearchInput } from "../common/SearchInput";
import { Text } from "../ui/text";
import { FilterChoices } from "../common/FilterChoices";
import { Separator } from "../ui/separator";
import { View } from "react-native";

export const HomePageHeader = () => {
  return (
    <View className="flex-1 px-5">
      <SearchInput className="my-5" placeholder="Search for jobs..." />

      <View className="flex flex-col gap-2">
        <Text className="text-gray-800 dark:text-gray-200 text-sm">
          Filter Jobs
        </Text>
        <Separator />
      </View>
      <FilterChoices />
      <View className="flex flex-col gap-2">
        <Text className="text-gray-800 dark:text-gray-200 text-sm">
          List Of Jobs
        </Text>
        <Separator />
      </View>
    </View>
  );
};
