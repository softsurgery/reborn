import { SearchInput } from "../common/SearchInput";
import { Text } from "../ui/text";
import { FilterChoices } from "../common/FilterChoices";
import { Separator } from "../ui/separator";
import { View } from "react-native";

interface HomePageHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultsCount?: number;
}

export const HomePageHeader = ({
  searchQuery,
  onSearchChange,
  resultsCount,
}: HomePageHeaderProps) => {
  return (
    <View className="flex-1 px-5">
      <SearchInput
        className="my-5"
        placeholder="Search for jobs..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />

      <View className="flex flex-col gap-2">
        <Text className="text-gray-800 dark:text-gray-200 text-sm">
          Filter Jobs
        </Text>
        <Separator />
      </View>
      <FilterChoices />
      <View className="flex flex-col gap-2">
        <Text className="text-gray-800 dark:text-gray-200 text-sm">
          {searchQuery.trim()
            ? `List Of Jobs (${resultsCount} found)`
            : "List Of Jobs"}
        </Text>
        <Separator />
      </View>
    </View>
  );
};
